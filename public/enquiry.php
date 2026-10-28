<?php
// Kayal Breeze — room enquiry handler. Emails each valid enquiry to the homestay.

const TO_EMAIL = 'kayalbreeze2026@gmail.com';
const MIN_SECONDS = 3;        // faster submissions are treated as bots
const MAX_PER_HOUR = 5;       // per IP address

$wantsJson = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

function respond(bool $ok, string $message = '', array $errors = []): void {
    global $wantsJson;
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message, 'errors' => (object) $errors]);
        exit;
    }
    if ($ok) {
        header('Location: contact.html#sent', true, 303);
        exit;
    }
    http_response_code(400);
    $list = '';
    foreach (array_merge([$message], array_values($errors)) as $line) {
        if ($line !== '') $list .= '<li>' . htmlspecialchars($line) . '</li>';
    }
    echo '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
       . '<title>Enquiry not sent — Kayal Breeze</title>'
       . '<body style="font:18px/1.5 system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem">'
       . '<h1>Your enquiry was not sent</h1><ul>' . $list . '</ul>'
       . '<p><a href="contact.html">Go back to the form</a> or message us on '
       . '<a href="https://wa.me/919847392283">WhatsApp</a>.</p></body>';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html', true, 303);
    exit;
}

// Spam checks: honeypot, minimum fill time, per-IP rate limit.
$started = (int) ($_POST['started'] ?? 0);
if (!empty($_POST['website']) || ($started > 0 && (time() * 1000 - $started) < MIN_SECONDS * 1000)) {
    respond(true); // pretend success so bots learn nothing
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/kb_enquiry_' . md5($ip);
$hits = array_filter(
    is_file($rateFile) ? (array) json_decode((string) file_get_contents($rateFile), true) : [],
    fn($t) => $t > time() - 3600
);
if (count($hits) >= MAX_PER_HOUR) {
    respond(false, 'Too many enquiries from this connection. Please message us on WhatsApp instead.');
}

// Validation.
$clean = fn($k, $max) => trim(mb_substr(str_replace(["\r", "\0"], '', (string) ($_POST[$k] ?? '')), 0, $max));
$name     = $clean('name', 80);
$phone    = $clean('phone', 20);
$checkin  = $clean('checkin', 10);
$checkout = $clean('checkout', 10);
$guests   = $clean('guests', 10);
$rooms    = $clean('rooms', 2);
$roomType = $clean('room_type', 30);
$notes    = $clean('notes', 1000);

$errors = [];
if (mb_strlen($name) < 2) $errors['name'] = 'Please enter your full name.';

$digits = preg_replace('/\D/', '', $phone);
if (!preg_match('/^[+\d][\d\s()-]{7,}$/', $phone) || strlen($digits) < 10 || strlen($digits) > 15) {
    $errors['phone'] = 'Enter a valid mobile number.';
}

$in  = DateTime::createFromFormat('!Y-m-d', $checkin);
$out = DateTime::createFromFormat('!Y-m-d', $checkout);
$today = new DateTime('today', new DateTimeZone('Asia/Kolkata'));
if (!$in) $errors['checkin'] = 'Choose a check-in date.';
elseif ($in < $today) $errors['checkin'] = 'Check-in cannot be in the past.';
if (!$out) $errors['checkout'] = 'Choose a check-out date.';
elseif ($in && $out <= $in) $errors['checkout'] = 'Check-out must be after check-in.';

if (!in_array($guests, ['1', '2', '3', '4', '5', '6 or more'], true)) $errors['guests'] = 'Choose the number of guests.';
if (!in_array($rooms, ['1', '2', '3', '4', '5', '6'], true)) $errors['rooms'] = 'Choose the number of rooms.';
if (!in_array($roomType, ['AC Room', 'Non-AC Room', 'Any Available Room'], true)) $errors['room_type'] = 'Choose a room type.';

if ($errors) respond(false, 'Please correct the highlighted fields.', $errors);

// Send.
$nights = $in->diff($out)->days;
$body = "New room enquiry from the Kayal Breeze website\n\n"
      . "Full name:        $name\n"
      . "Mobile/WhatsApp:  $phone\n"
      . "Check-in:         " . $in->format('d M Y') . "\n"
      . "Check-out:        " . $out->format('d M Y') . " ($nights night" . ($nights === 1 ? '' : 's') . ")\n"
      . "Guests:           $guests\n"
      . "Rooms:            $rooms\n"
      . "Room type:        $roomType\n"
      . "Additional:       " . ($notes !== '' ? $notes : '—') . "\n\n"
      . "WhatsApp the guest: https://wa.me/" . (strlen($digits) === 10 ? '91' . $digits : $digits) . "\n"
      . "Sent " . (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('d M Y, H:i') . " IST from $ip\n";

$host = preg_replace('/^www\./', '', preg_replace('/:\d+$/', '', $_SERVER['SERVER_NAME'] ?? 'localhost'));
$from = 'noreply@' . $host;
$subject = '=?UTF-8?B?' . base64_encode("Room enquiry: $name, " . $in->format('d M') . ' – ' . $out->format('d M Y')) . '?=';
$headers = "From: Kayal Breeze Website <$from>\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n"
         . "X-Mailer: PHP/" . PHP_VERSION;

if (!@mail(TO_EMAIL, $subject, $body, $headers, '-f' . $from)) {
    respond(false, 'We could not send your enquiry just now. Please message us on WhatsApp: +91 98473 92283.');
}

$hits[] = time();
@file_put_contents($rateFile, json_encode(array_values($hits)));
respond(true);
