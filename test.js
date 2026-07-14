function formatCardName(color, value) {
    const formattedColor = color.charAt(0).toUpperCase() + color.slice(1);
    let formattedValue = value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    formattedValue = formattedValue.replace(/([a-zA-Z])(\d+)/g, '$1 $2');
    return `${formattedColor} ${formattedValue}`;
}
console.log(formatCardName('yellow', 'wild_draw10'));
