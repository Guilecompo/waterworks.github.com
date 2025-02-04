<?php
// CORS headers
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost");  // Allow requests from localhost (adjust as needed)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");  // Allow POST, GET, OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type");  // Allow Content-Type header

// If the request is an OPTIONS request (preflight request), respond with status 200 and exit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'connection.php';  // Ensure this path is correct
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get readerId from POST data
        $readerId = isset($_POST['readerId']) ? $_POST['readerId'] : null;

        if (!$readerId) {
            echo json_encode(["error" => "No readerId provided"]);
            exit;
        }

        // Fetch the zones assigned to the reader
        $stmt = $conn->prepare("SELECT a.zone_Id FROM assign a WHERE a.emp_Id = :readerId");
        $stmt->bindParam(":readerId", $readerId);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$rows) {
            echo json_encode(["error" => "No data found for the given readerId"]);
            exit;
        }

        // Get all zone IDs the reader is assigned to
        $zones = array_column($rows, 'zone_Id');

        // Query to count total consumers in those zones
        $stmt = $conn->prepare("SELECT COUNT(*) as total_consumers
            FROM user_consumer a
            WHERE a.addressId IN (" . implode(',', $zones) . ")");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $totalConsumers = $result['total_consumers'];

        // Query to count consumers with billing status not 1 (reading left)
        $stmt = $conn->prepare("SELECT COUNT(*) as total_consumers
            FROM user_consumer a
            WHERE a.billing_status != 1
            AND a.addressId IN (" . implode(',', $zones) . ")");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $readingLeft = $result['total_consumers'];

        // Get the current month and year
        $currentMonth = date('m'); // Current month (e.g., "10" for October)
        $currentYear = date('Y');  // Current year (e.g., "2024")

        // Query to calculate total cubic consumed this month, filtering by current month and year
        $stmt = $conn->prepare("SELECT SUM(cubic_consumed) AS totalCubic
            FROM billing
            WHERE readerId = :readerId
            AND MONTH(reading_date) = :currentMonth
            AND YEAR(reading_date) = :currentYear");
            
        $stmt->bindParam(":readerId", $readerId, PDO::PARAM_INT);
        $stmt->bindParam(":currentMonth", $currentMonth, PDO::PARAM_INT);
        $stmt->bindParam(":currentYear", $currentYear, PDO::PARAM_INT);
        $stmt->execute();

        $totalCubicResult = $stmt->fetch(PDO::FETCH_ASSOC);
        $totalCubic = $totalCubicResult['totalCubic'] ? $totalCubicResult['totalCubic'] : 0;

        // Prepare response
        $response = [
            "total_consumers" => $totalConsumers,
            "reading_left" => $readingLeft,
            "total_consumed" => $totalCubic
        ];

        echo json_encode($response);

    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
}
?>
