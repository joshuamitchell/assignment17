"using strict"

async function showBands(){
    let response = await fetch(`api/bands/`);
    let bands = await response.json();
    let bandsDiv = document.getElementById("bands");
    bandsDiv.innerHTML = "";

    for(i in bands){
        bandsDiv.appendChild(createBandSection(bands[i]));
    }
}

function createBandSection(band){
    let bandDiv = document.createElement("div");
    bandDiv.classList.add("band");
    let bandContent = document.createElement("div");
    bandContent.classList.add("band-content");
    bandDiv.append(bandContent);

    //create an image to expand and contract the band details
    let bandHeader1 = document.createElement("div");
    let bandHeader2 = document.createElement("div");
    let bandTitle = document.createElement("h3");
    let bandLink = document.createElement("a");
    let bandImg = document.createElement("img");
    bandImg.src = "images/vinyl_record.jpg";
    bandLink.append(bandImg);
    bandLink.onclick = expandBand;
    bandLink.setAttribute("href", "#");
    bandLink.setAttribute("data-id", band._id);
    bandTitle.innerHTML = band.name;
    bandHeader1.append(bandTitle);
    bandHeader2.append(bandLink);
    bandHeader1.classList.add('band-heading1');
    bandHeader2.classList.add('band-heading2');
    bandHeader1.append(getButtons(band));
    bandContent.append(bandHeader1);
    bandContent.append(bandHeader2);
    bandContent.appendChild(getBandExpand(band));

    return bandDiv;
}

function getButtons(band){
    let btnDiv = document.createElement("div");
    let editBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");
    editBtn.innerHTML = "Edit"
    deleteBtn.innerHTML = "Delete";
    editBtn.setAttribute("data-id", band._id);
    deleteBtn.setAttribute("data-id", band._id);
    editBtn.onclick = showEditBand;
    deleteBtn.onclick = deleteBand;

    btnDiv.append(editBtn);
    btnDiv.append(deleteBtn);

    return btnDiv;
}

function getBandExpand(band){
    //add the band details
    bandExpand = document.createElement("div");
    bandExpand.setAttribute("id", band._id);
    bandExpand.classList.add("hidden");
    nameP = document.createElement('p');
    nameP.innerHTML = `<b>Name: </b> ${band.name}`;
    genreP = document.createElement("p");
    genreP.innerHTML = `<b>Genre: </b> ${band.genre}`;
    dateP = document.createElement('p');
    dateP.innerHTML = `<b>Date Founded: </b> ${band.date}`;
    activeP = document.createElement('p');
    activeP.innerHTML = `<b>Is the Band Active?: </b> ${band.active}`;
    
    bandExpand.append(nameP);
    bandExpand.append(genreP);
    bandExpand.append(dateP);
    bandExpand.append(activeP);
    bandExpand.append(getMembersElem(band));
    bandExpand.append(getSongsElem(band));

    return bandExpand;
}

function getMembersElem(band){
    return getArrayInfo("Members", band.members);
}

function getSongsElem(band){
    return getArrayInfo("Songs", band.songs);
}

function getArrayInfo(title, list){
    let divContent = document.createElement("div");
    let divTitle = document.createElement("h4");
    divTitle.innerHTML = title + ": ";
    divContent.append(divTitle);

    let ulElem = document.createElement("ul");
    for(i in list){
        liElem = document.createElement("li");
        liElem.innerHTML = list[i];
        ulElem.append(liElem);
    }
    divContent.append(ulElem);
    return divContent;
}

function expandBand()
{
    let expandId = this.getAttribute("data-id");
    let expandElem = document.getElementById(expandId);
    expandElem.classList.toggle("hidden");
    return false;
}


async function addBand(){
    const name = document.getElementById("add-band-name").value;
    const genre = document.getElementById("add-band-genre").value;
    const date = document.getElementById("add-band-date").value;
    const active = document.getElementById("add-band-active").value;
    const membersText = document.getElementById("add-band-members").value;
    const songsText = document.getElementById("add-band-songs").value;
    const members = membersText.split("\n");
    const songs = songsText.split("\n");
    const feedbackP = document.getElementById("add-feedback");
    feedbackP.classList.remove("error");
    feedbackP.classList.remove("success");
    feedbackP.classList.remove("hidden");

    let band = {"name": name, "genre": genre, "date": date, "active": active, "members": members, "songs": songs};
    console.log(band);

    let response = await fetch('/api/bands/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(band),
    });

    if(response.status != 200){
        feedbackP.innerHTML = "Error Adding Band";
        feedbackP.classList.add("error");

        await delay(3000);
        feedbackP.remove();
        return;
    }

    let result = await response.json();
    feedbackP.innerHTML = "Successfully Added Band";
    feedbackP.classList.add("success");

    await delay(3000);
    feedbackP.remove();
    showBands();
}

async function editBand(){
    const id = document.getElementById("edit-band-id").textContent;
    const name = document.getElementById("edit-band-name").value;
    const genre = document.getElementById("edit-band-genre").value;
    const date = document.getElementById("edit-band-date").value;
    const active = document.getElementById("edit-band-active").value;
    const membersText = document.getElementById("edit-band-members").value;
    const songsText = document.getElementById("edit-band-songs").value;
    const members = membersText.split("\n");
    const songs = songsText.split("\n");
    const feedbackP = document.getElementById("edit-feedback");
    feedbackP.classList.remove("error");
    feedbackP.classList.remove("success");
    feedbackP.classList.remove("hidden");

    let band = {"name": name, "genre": genre, "date": date, "active": active, "members": members, "songs": songs};
    console.log(band);

    let response = await fetch(`/api/bands/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(band),
    });

    if(response.status != 200){
        feedbackP.innerHTML = "Error Editing Band";
        feedbackP.classList.add("error");
        
        await delay(3000);
        feedbackP.remove();
        return;
    }

    let result = await response.json();
    feedbackP.innerHTML = "Successfully Editted Band";
    feedbackP.classList.add("success");

    await delay(3000);
    feedbackP.remove();
    showBands();
}

async function showEditBand(){
    let bandId = this.getAttribute("data-id");
    document.getElementById("edit-band-id").textContent = bandId;

    let response = await fetch(`api/bands/${bandId}`);

    if(response.status != 200){
        console.log("Error Displaying band");
        return;
    }

    let band = await response.json();
    document.getElementById('edit-band-name').value = band.name;
    document.getElementById("edit-band-genre").value = band.genre;
    document.getElementById("edit-band-date").value = band.date;
    document.getElementById("edit-band-active").value = band.active;
    if(band.members != null){
        document.getElementById("edit-band-members").value = band.members.join('\n');
    }
    if(band.songs != null){
        document.getElementById("edit-band-songs").value = band.songs.join('\n');
    }
}

async function deleteBand(){
    let bandId = this.getAttribute('data-id');

    let response = await fetch(`/api/bands/${bandId}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        }
    });

    if(response.status != 200){
        console.log("Error deleting band");
        return;
    }
    
    let result = await response.json();
    console.log("Successful delete");
    showBands();
}

function formToggle() {
    let hideElem = document.getElementById("band-forms");
    hideElem.classList.toggle("hidden");
}

const delay = ms => new Promise(res => setTimeout(res, ms));

window.onload = function(){
    this.document.getElementById("btn-add-band").onclick = addBand;
    this.showBands();

    this.document.getElementById("btn-edit-band").onclick = editBand;

    let toggleBtn = document.getElementById("btn-show-band-forms");
    toggleBtn.onclick = this.formToggle;
}