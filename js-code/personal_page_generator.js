function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(';').map(header => header.trim());
    const data = lines.slice(1).map(line => {
        const values = line.split(';').map(value => value.trim());
        const entry = headers.reduce((obj, header, index) => {
            obj[header] = values[index] || ''; // Use an empty string if the value is undefined
            return obj;
        }, {});
        return entry;
    });
    return data;
}

async function create_personal_page() {
    const response = await fetch('./public/personal_info.csv');
    const text = await response.text();
    const data = parseCSV(text);

    const projectsContainer = document.createElement("div");
    projectsContainer.className = "personal-projects";
    projectsContainer.innerHTML = `
        <div class="thesis-page-introduction">
            <h2>Personal Projects</h2>
            <div class="title-line"></div>
            Below is a collection of personal projects I've completed over the past five years. Each project includes a brief description, relevant keywords, and a GitHub link, if available.
        </div>
    `

    data.forEach(project => {
        const projectContainer = document.createElement("div");
        projectContainer.className = "project-container";

        const textContainer = document.createElement("div");
        textContainer.className = "text-container";

        textContainer.innerHTML = `
            <div class="project-description">
                <h4 class="project-title">${project.title}</h4>
                <i>${project.description}</i>
            </div>
            <div class="project-keywords"><b>Keywords:</b><br> ${project.keywords}</div>
        `;
        if(project.github === ""){
            textContainer.innerHTML += `<a class="project-link-missing">GITHUB MISSING</a>`;
        }else {
            textContainer.innerHTML += `<a href="${project.github}" target="_blank" class="project-link">GITHUB LINK</a>`;
        }

        const imageContainer = document.createElement("div");
        imageContainer.className = "image-container";

        if (project.is_video === "1") {
            const video = document.createElement("video");
            video.muted = true;
            video.setAttribute('muted', ''); // Note: I have no idea why `video.muted = true;` is not enough and even worse when I remove `video.muted = true;` the setAttribute stops working...
            video.src = project.source_path;
            video.className = "project-video";
            video.autoplay = true;
            video.loop = true;
            video.controls = true;
            imageContainer.appendChild(video);
        } else {
            const image = document.createElement("img");
            image.src = project.source_path;
            image.alt = "Project Image";
            image.className = "project-image";
            imageContainer.appendChild(image);
        }

        projectContainer.appendChild(textContainer);
        projectContainer.appendChild(imageContainer);
        projectsContainer.appendChild(projectContainer);
    });
    return projectsContainer.outerHTML;
}