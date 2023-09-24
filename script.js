(function () {
    function manageAnswer() {
        buttons = Array.from(buttons);
        if (blobSize in peoples) {
            for (const correctName in peoples[blobSize]) {
                var found = -1;
                for (let i = 0; i <= 3; i++) {
                    var txtButton = buttons[i].textContent.toLowerCase();
                    if (txtButton.includes(correctName.toLowerCase())) {
                        found = i;
                        buttons[i].click();
                    }
                }
                if (found == -1) {
                    buttons[0].click();
                }
            }
        }
        else {
            buttons[0].click();
        }
    }

    function newXHR() {
        var xhr = new originalXHR();

        xhr.addEventListener('load', function () {
            if (xhr.responseURL.includes('next')) {
                var rep = JSON.parse(xhr.response);
                suggestions = rep.suggestions;
                var fullURL = 'your url' + rep.imageUrl;
                fetch(fullURL)
                    .then(response => {
                        if (response.ok) {
                            var faceImg = response.blob();
                            return faceImg;
                        } else {
                            throw new Error("Error load image");
                        }
                    })
                    .then(imageBlob => {
                        blobSize = imageBlob.size;
                        setTimeout(function () {
                            try {
                            buttons = [...document.querySelectorAll('#game > app-question > div')][0].children;
                            manageAnswer();
                            } catch (error) {
                                // low network
                                setTimeout(function () {
                                    buttons = [...document.querySelectorAll('#game > app-question > div')][0].children;
                                    manageAnswer();
                                }, 500);
                                console.log(error.message);
                            }

                        }, 200);
                    })
                    .catch(error => {
                        console.log(error.message);
                    });

            } else if (xhr.responseURL.includes('guess')) {
                var rep = JSON.parse(xhr.response);
                correctSuggestionId = rep.correctSuggestionId;

                for (let i = 0; i <= 3; i++) {
                    if (suggestions[i].id == correctSuggestionId) {

                        if (blobSize in peoples) {
                            peoples[blobSize][suggestions[i].value] = 1;
                        }
                        else {
                            peoples[blobSize] = {};
                            peoples[blobSize][suggestions[i].value] = 1;
                        }
                    }
                }
            }

        });

        return xhr;
    }

    var originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = newXHR;

    const peoples = {};

    var blobSize;
    var buttons;
    var suggestions;
    var correctSuggestionId;
})();
