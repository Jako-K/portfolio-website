document.addEventListener('DOMContentLoaded', function() {
    let screenWidth = window.innerWidth;
    let desiredWidth = 1300;
    if (screenWidth < desiredWidth) {
        let scale = screenWidth / desiredWidth;
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=' + desiredWidth + ', initial-scale=' + scale);
    }
});