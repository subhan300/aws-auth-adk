export function getCurrentTimestamp() {
    const timestamp = dayjs()
    console.log(timestamp.format('ddd MMM D HH:mm:ss [UTC] YYYY'))
    return timestamp.format('ddd MMM D HH:mm:ss [UTC] YYYY');
}
