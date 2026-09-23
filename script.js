// ============================
// NOTEWORDS
// ============================


// ============================
// WRITE BUTTON
// ============================

const writeButton = document.querySelector(".write-button");

if (writeButton) {

    writeButton.addEventListener("click", function () {

        window.location.href = "write.html";

    });

}


// ============================
// PAGE DETECTION
// ============================

const feed = document.querySelector(".feed");

const savedFeed =
    document.querySelector("#savedFeed");

const profileNotes =
    document.querySelector("#profileNotes");


// ============================
// HOME PAGE
// ============================

if (feed && !savedFeed && !profileNotes) {

    const savedNotes = JSON.parse(
        localStorage.getItem("noteWordsNotes")
    ) || [];

    savedNotes.forEach(function (note) {

        createNoteCard(note, feed);

    });

}


// ============================
// SAVED PAGE
// ============================

if (savedFeed) {

    const savedNotes = JSON.parse(
        localStorage.getItem("noteWordsNotes")
    ) || [];

    const savedOnly = savedNotes.filter(function (note) {

        return note.saved === true;

    });


    if (savedOnly.length === 0) {

        savedFeed.innerHTML = `
            <div class="empty-saved">
                <p>Nothing saved yet.</p>

                <span>
                    When a word stays with you,
                    save it here.
                </span>
            </div>
        `;

    } else {

        savedOnly.forEach(function (note) {

            createNoteCard(note, savedFeed);

        });

    }

}


// ============================
// PROFILE PAGE
// ============================

if (profileNotes) {

    const notes = JSON.parse(
        localStorage.getItem("noteWordsNotes")
    ) || [];


    const noteCount =
        document.querySelector("#noteCount");

    const savedCount =
        document.querySelector("#savedCount");


    noteCount.textContent =
        notes.length;


    savedCount.textContent =
        notes.filter(function (note) {

            return note.saved === true;

        }).length;


    if (notes.length === 0) {

        profileNotes.innerHTML = `
            <div class="empty-saved">

                <p>
                    Your words will appear here.
                </p>

                <span>
                    Write your first note
                    and let it live here.
                </span>

            </div>
        `;

    } else {

        notes.forEach(function (note) {

            createNoteCard(note, profileNotes);

        });

    }

}


// ============================
// CREATE NOTE CARD
// ============================

function createNoteCard(note, container) {

    const noteCard =
        document.createElement("article");


    noteCard.className =
        "note-card";


    noteCard.innerHTML = `

        <div class="note-top">

            <div class="author">

                <div class="avatar avatar-green"></div>

                <div>

                    <h3>
                        ${note.author || "You"}
                    </h3>

                    <p>
                        ${note.time || "Just now"}
                    </p>

                </div>

            </div>


            <button class="menu">
                ☰
            </button>

        </div>


        <div class="small-line green-line"></div>


        <p class="note-text">
            ${note.text}
        </p>


        <div class="note-actions">

            <div>

                <button class="like-button">

                    ${note.liked ? "♥" : "♡"}

                    <span>
                        ${note.likes || 0}
                    </span>

                </button>


                <button class="reply-button">
                    Reply
                </button>

            </div>


            <button class="save-button">

                ${note.saved ? "▣" : "♧"}

            </button>

        </div>

    `;


    // ============================
    // LIKE BUTTON
    // ============================

    const likeButton =
        noteCard.querySelector(".like-button");


    likeButton.addEventListener(
        "click",
        function () {

            note.liked =
                !note.liked;


            if (note.liked) {

                note.likes =
                    (note.likes || 0) + 1;

            } else {

                note.likes =
                    Math.max(
                        0,
                        (note.likes || 0) - 1
                    );

            }


            const notes = JSON.parse(
                localStorage.getItem("noteWordsNotes")
            ) || [];


            const index =
                notes.findIndex(function (item) {

                    return item.id === note.id;

                });


            if (index !== -1) {

                notes[index].likes =
                    note.likes;

                notes[index].liked =
                    note.liked;


                localStorage.setItem(
                    "noteWordsNotes",
                    JSON.stringify(notes)
                );

            }


            likeButton.innerHTML = `

                ${note.liked ? "♥" : "♡"}

                <span>
                    ${note.likes || 0}
                </span>

            `;

        }
    );


    // ============================
    // SAVE BUTTON
    // ============================

    const saveButton =
        noteCard.querySelector(".save-button");


    saveButton.addEventListener(
        "click",
        function () {

            note.saved =
                !note.saved;


            const notes = JSON.parse(
                localStorage.getItem("noteWordsNotes")
            ) || [];


            const index =
                notes.findIndex(function (item) {

                    return item.id === note.id;

                });


            if (index !== -1) {

                notes[index].saved =
                    note.saved;


                localStorage.setItem(
                    "noteWordsNotes",
                    JSON.stringify(notes)
                );

            }


            saveButton.textContent =
                note.saved ? "▣" : "♧";


            // Remove from Saved page
            // when unsaved

            if (
                savedFeed &&
                !note.saved
            ) {

                noteCard.remove();


                if (
                    savedFeed.children.length === 0
                ) {

                    savedFeed.innerHTML = `

                        <div class="empty-saved">

                            <p>
                                Nothing saved yet.
                            </p>

                            <span>
                                When a word stays with you,
                                save it here.
                            </span>

                        </div>

                    `;

                }

            }

        }
    );


    // ============================
    // REPLIES
    // ============================

    const replyButton =
        noteCard.querySelector(".reply-button");


    const replyArea =
        document.createElement("div");


    replyArea.className =
        "reply-area";


    replyArea.innerHTML = `

        <textarea
            class="reply-input"
            maxlength="300"
            placeholder="Write a reply..."
        ></textarea>


        <div class="reply-bottom">

            <span class="reply-count">
                0 / 300
            </span>


            <button class="reply-submit">
                Reply
            </button>

        </div>


        <div class="reply-list"></div>

    `;


    replyArea.style.display =
        "none";


    noteCard.appendChild(
        replyArea
    );


    // ============================
    // OPEN REPLY AREA
    // ============================

    replyButton.addEventListener(
        "click",
        function () {

            if (
                replyArea.style.display ===
                "none"
            ) {

                replyArea.style.display =
                    "block";

            } else {

                replyArea.style.display =
                    "none";

            }

        }
    );


    // ============================
    // REPLY CHARACTER COUNT
    // ============================

    const replyInput =
        replyArea.querySelector(
            ".reply-input"
        );


    const replyCount =
        replyArea.querySelector(
            ".reply-count"
        );


    replyInput.addEventListener(
        "input",
        function () {

            replyCount.textContent =
                `${replyInput.value.length} / 300`;

        }
    );


    // ============================
    // POST REPLY
    // ============================

    const replySubmit =
        replyArea.querySelector(
            ".reply-submit"
        );


    const replyList =
        replyArea.querySelector(
            ".reply-list"
        );


    replySubmit.addEventListener(
        "click",
        function () {

            const text =
                replyInput.value.trim();


            if (text === "") {

                return;

            }


            const replies = JSON.parse(
                localStorage.getItem(
                    "noteWordsReplies"
                )
            ) || [];


            const newReply = {

                id: Date.now(),

                noteId: note.id,

                text: text,

                author: "You",

                createdAt:
                    new Date().toISOString()

            };


            replies.push(
                newReply
            );


            localStorage.setItem(
                "noteWordsReplies",
                JSON.stringify(replies)
            );


            addReplyToPage(
                newReply,
                replyList
            );


            replyInput.value =
                "";

            replyCount.textContent =
                "0 / 300";

        }
    );


    // ============================
    // LOAD EXISTING REPLIES
    // ============================

    const allReplies = JSON.parse(
        localStorage.getItem(
            "noteWordsReplies"
        )
    ) || [];


    const noteReplies =
        allReplies.filter(function (reply) {

            return reply.noteId === note.id;

        });


    noteReplies.forEach(function (reply) {

        addReplyToPage(
            reply,
            replyList
        );

    });


    // ============================
    // ADD CARD TO PAGE
    // ============================

    container.appendChild(
        noteCard
    );

}


// ============================
// DISPLAY REPLY
// ============================

function addReplyToPage(
    reply,
    container
) {

    const replyElement =
        document.createElement("div");


    replyElement.className =
        "reply-item";


    replyElement.innerHTML = `

        <div class="reply-avatar">
            Y
        </div>


        <div class="reply-content">

            <strong>
                ${reply.author}
            </strong>


            <p>
                ${reply.text}
            </p>

        </div>

    `;


    container.appendChild(
        replyElement
    );

}