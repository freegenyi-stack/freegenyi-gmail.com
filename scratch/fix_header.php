<?php
$file = 'c:\Users\Yousr\freegonya\includes\header.php';
$content = file_get_contents($file);

// Target block to replace (regex)
$pattern = '/userId: userId,\s+emojiPickerOpen: false,\s+toast: null,\s+emojis: \{.*?\},\s+emojiCategory: \'Visages\',\s+contacts: \[\],\s+sounds: \{.*?\},\s+recordingTime: 0,\s+recordingInterval: null,/s';

$replacement = "userId: userId,
            emojiPickerOpen: false,
            toast: null,
            picker: null,
            contacts: [],
            sounds: {
                send:    new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3'),
                receive: new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3'),
                notif:   new Audio('https://assets.mixkit.co/active_storage/sfx/1862/1862-preview.mp3')
            },
            recordingTime: 0,
            recordingInterval: null,";

$newContent = preg_replace($pattern, $replacement, $content);

if ($newContent !== $content) {
    file_put_contents($file, $newContent);
    echo "SUCCESS: File updated.";
} else {
    echo "ERROR: Pattern not found.";
    // Fallback: search for emojis object start and end
    $start = strpos($content, 'emojis: {');
    $end = strpos($content, 'contacts: [],', $start);
    if ($start !== false && $end !== false) {
        $before = substr($content, 0, $start);
        $after = substr($content, $end);
        $final = $before . "picker: null,\n            " . $after;
        file_put_contents($file, $final);
        echo "SUCCESS: Fallback replacement done.";
    }
}
