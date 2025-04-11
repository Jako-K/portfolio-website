// Function to load an HTML file into a DocumentFragment
async function loadHTMLFile(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const fragment = document.createRange().createContextualFragment(text);
        return fragment;
    } catch (error) {
        console.error('Error loading HTML file:', error);
        return null;
    }
}

// Function to convert media URLs to Base64
function convertMediaToBase64(url) {
    return fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        }));
}

// Function to replace media paths with Base64 strings in HTML
async function replaceMediaWithBase64(fragment) {
    const mediaElements = fragment.querySelectorAll('img, video, source');

    for (let media of mediaElements) {
        const base64String = await convertMediaToBase64(media.src);
        media.src = base64String;
    }

    return fragment;
}

// Function to load and convert a page
async function loadPage(url, pageKey) {
    const fragment = await loadHTMLFile(url);
    if (fragment) {
        PAGES[pageKey] = fragment;
        replaceMediaWithBase64(fragment).then(convertedFragment => {
            PAGES[pageKey] = convertedFragment;
        });
    }
}

// Function to handle button click and load content
function handleButtonClick(buttonText) {
    updateButtonSelection(buttonText); // Immediate style update

    // Use setTimeout with a very short delay to ensure the style update happens before loading content
    setTimeout(() => {
        loadContent(buttonText);
    }, 0);
}

// Function to load content based on button click
function loadContent(buttonText) {
    document.getElementById('content-container').innerHTML = "";
    let currentPath = window.location.pathname;

    switch(buttonText) {
        case 'homeButtonContainer':
            document.getElementById('content-container').appendChild(PAGES["home"].cloneNode(true));
            history.pushState(null, '', currentPath + '?page=home');
            break;
        case 'cvButtonContainer':
            document.getElementById('content-container').appendChild(PAGES["cv"].cloneNode(true));
            history.pushState(null, '', currentPath + '?page=cv');
            break;
        case 'professionalButtonContainer':
            document.getElementById('content-container').appendChild(PAGES["work"].cloneNode(true));
            history.pushState(null, '', currentPath + '?page=work');
            break;
        case 'personalButtonContainer':
            document.getElementById('content-container').appendChild(PAGES["personal"].cloneNode(true));
            history.pushState(null, '', currentPath + '?page=projects');
            break;
        case 'bscButtonContainer':
            document.getElementById('content-container').appendChild(PAGES["bsc"].cloneNode(true));
            history.pushState(null, '', currentPath + '?page=bsc');
            break;
        case 'mscButtonContainer':
            document.getElementById('content-container').appendChild(PAGES["msc"].cloneNode(true));
            history.pushState(null, '', currentPath + '?page=msc');
            break;
        case 'coursesButtonContainer':
            document.getElementById('content-container').appendChild(PAGES["courses"].cloneNode(true));
            history.pushState(null, '', currentPath + '?page=courses');
            break;
        default:
            console.error('Unknown button text:', buttonText);
            break;
    }
}

// Function to update button selection style
function updateButtonSelection(buttonTextSelected) {
    const buttons = document.querySelectorAll('.base-button');
    buttons.forEach(button => {
        if (button.id === buttonTextSelected) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}

// Initialize the page content
async function init() {
    // Load all pages and wait for them to complete
    await Promise.all([
        loadPage('./html-code/page-home.html', 'home'),
        loadPage('./html-code/page-cv.html', 'cv'),
        loadPage('./html-code/page-work.html', 'work'),
        loadPage('./html-code/page-bsc.html', 'bsc'),
        loadPage('./html-code/page-msc.html', 'msc'),
        create_personal_page().then(html => {
            const fragment = document.createRange().createContextualFragment(html);
            PAGES["personal"] = fragment;
            replaceMediaWithBase64(fragment).then(convertedFragment => {
                PAGES["personal"] = convertedFragment;
            });
        }),
        create_courses_page().then(html => {
            const fragment = document.createRange().createContextualFragment(html);
            PAGES["courses"] = fragment;
            replaceMediaWithBase64(fragment).then(convertedFragment => {
                PAGES["courses"] = convertedFragment;
            });
        })
    ]);

    // Load the header
    const response = await fetch("./html-code/header.html");
    document.getElementById("header-container").innerHTML = await response.text();

    // Add event listeners to the buttons
    const buttons = document.querySelectorAll('.base-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            handleButtonClick(button.id);
        });
    });

    // Extract info about page
    const urlParams = new URLSearchParams(window.location.search);
    const extraInfo = urlParams.get('page');
    if (extraInfo) {
        SPECIFIC_PAGE_FLAG = extraInfo;
    }
    // Update button selection and handle flag
    switch(SPECIFIC_PAGE_FLAG) {
        case "home":
        case null:
        case undefined:
            handleButtonClick("homeButtonContainer");break;
        case 'cv':
            handleButtonClick("cvButtonContainer"); break;
        case 'work':
            handleButtonClick("professionalButtonContainer"); break;
        case 'projects':
            handleButtonClick("personalButtonContainer"); break;
        case 'bsc':
            handleButtonClick("bscButtonContainer"); break;
        case 'msc':
            handleButtonClick("mscButtonContainer"); break;
        case 'courses':
            handleButtonClick("coursesButtonContainer"); break;
        default:
            console.error("Unexpected page flag: ", SPECIFIC_PAGE_FLAG);
            document.location.href = '404.html'; break;
    }
}



////////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////////


// Stores generated pages
let SPECIFIC_PAGE_FLAG = null;
let PAGES = {
    "personal": null,
    "courses": null,
    "home": null,
    "cv": null,
    "work": null,
    "bsc": null,
    "msc": null
};

// Dynamically calculate my age
document.addEventListener("DOMContentLoaded", init);
