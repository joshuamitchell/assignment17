"using strict"

async function showBands(){
    let response = await fetch(`api/bands/`);
    let bands = await response.json();
    let bandsDiv = document.getElementById("bands");
    bandsDiv.innerHTML = "";
    //console.log(bands);
    for(i in bands){
        bandsDiv.appendChild(getBandElem(bands[i]));
    }
}

function getBandElem(band){
    let bandDiv = document.createElement("div");
    bandDiv.classList.add("band");
    let bandContentDiv = document.createElement("div");
    bandContentDiv.classList.add("band-content");
    bandDiv.append(bandContentDiv);

    //create a link to expand and contract the band details
    let bandHeading = document.createElement("div");
    let bandA = document.createElement("a");
    let bandH3 = document.createElement("h3");
    bandA.append(bandH3);
    bandA.onclick = expandBand;
    bandA.setAttribute("href", "#");
    bandA.setAttribute("data-id", band._id);
    bandH3.innerHTML = band.name;
    bandHeading.append(bandA);
    bandHeading.classList.add('band-heading');
    bandHeading.append(getBandButtons(band));
    bandContentDiv.append(bandHeading);
    bandContentDiv.appendChild(getBandExpand(band));
    return bandDiv;
}

function getBandButtons(band){
    let buttonsDiv = document.createElement("div");
    let editButton = document.createElement("button");
    let deleteButton = document.createElement("button");
    editButton.innerHTML = "Edit"
    deleteButton.innerHTML = "Delete";
    editButton.setAttribute("data-id", band._id);
    deleteButton.setAttribute("data-id", band._id);
    editButton.onclick = showEditBand;
    deleteButton.onclick = deleteBand;

    buttonsDiv.append(editButton);
    buttonsDiv.append(deleteButton);

    return buttonsDiv;
}

async function showEditBand(){
    let bandId = this.getAttribute("data-id");
    document.getElementById("edit-band-id").textContent = bandId;

    let response = await fetch(`api/bands/${bandId}`);

    if(response.status != 200){
        //showError("Error Displaying band");
        return;
    }

    let band = await response.json();
    document.getElementById('txt-edit-band-name').value = band.name;
    document.getElementById("txt-edit-band-genre").value = band.genre;
    document.getElementById("txt-edit-band-date").value = band.date;
    document.getElementById("txt-edit-band-active").value = band.active;
    if(band.members != null){
        document.getElementById("txt-edit-band-members").value = band.members.join('\n');
    }
    if(band.songs != null){
        document.getElementById("txt-edit-band-songs").value = band.songs.join('\n');
    }
}

async function deleteBand(){
    //clearError();
    let bandId = this.getAttribute('data-id');

    let response = await fetch(`/api/bands/${bandId}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        }
    });

    if(response.status != 200){
        //showError("Error deleting band");
        console.log("Error deleting band");
        return;
    }
    
    let result = await response.json();
    console.log("successful delete");
    showBands();
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
    bandExpand.append(getMembersElement(band));
    bandExpand.append(getSongsElement(band));
    return bandExpand;
}

function getMembersElement(band){
    return getArrayInfo("Members", band.members);
}

function getSongsElement(band){
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
    const name = document.getElementById("txt-add-band-name").value;
    const genre = document.getElementById("txt-add-band-genre").value;
    const date = document.getElementById("txt-add-band-date").value;
    const active = document.getElementById("txt-add-band-active").value;
    const membersText = document.getElementById("txt-add-band-members").value;
    const songsText = document.getElementById("txt-add-band-songs").value;
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
    const name = document.getElementById("txt-edit-band-name").value;
    const genre = document.getElementById("txt-edit-band-genre").value;
    const date = document.getElementById("txt-edit-band-date").value;
    const active = document.getElementById("txt-edit-band-active").value;
    const membersText = document.getElementById("txt-edit-band-members").value;
    const songsText = document.getElementById("txt-edit-band-songs").value;
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
        return;
    }

    let result = await response.json();
    feedbackP.innerHTML = "Successfully Editted Band";
    feedbackP.classList.add("success");

    await delay(3000);
    feedbackP.remove();
    showBands();
}

const delay = ms => new Promise(res => setTimeout(res, ms));

window.onload = function(){
    this.document.getElementById("btn-add-band").onclick = addBand;
    this.showBands();

    this.document.getElementById("btn-edit-band").onclick = editBand;
}