'use strict';

(function() {

    var FLICKR_KEY = 'd94ae29f45c3389580b2c9dad30364b2';
    var SECRET = '6563d1f338e89ff5';
    var flickForm = document.querySelector('.flickr-form');
    var result = document.querySelector('#result');


    function getPhotosForSearch(keyWord) {

        return fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&api_key=${FLICKR_KEY}&text=${keyWord}`)
            .then(response => response.json())
            .then(data => {

                // Declare an empty array
                var myArray = [];

                // Loop through  the array of photos coming from the fetch
                data.photos.photo.forEach(function (element) {

                    // Create and object and set properties thumb, large and title
                    var photo = {
                        thumb: `https://farm${element.farm}.staticflickr.com/${element.server}/${element.id}_${element.secret}_b.jpg`,
                        large: `https://farm${element.farm}.staticflickr.com/${element.server}/${element.id}_${element.secret}_b.jpg`,
                        title: element.title
                    };

                    // Push object photo into myArray
                    myArray.push(photo);
                })

                // Return the array full of objects
                return myArray;

            })
            .catch(err => {
                console.log(err)
            })
        
    }


    flickForm.addEventListener('submit', function(event) {
        // Prevent the form from submitting
        event.preventDefault();

        // Capture the element  <input id="keyWord" type="text">
        var keyWord = flickForm.querySelector('#keyWord');

        getPhotosForSearch(keyWord.value)
            .then(data => {

                console.log('Result: ', data);

                // Loop through the array
                data.forEach(function (photoData) {
                    // Append every element of the array to <div id="result">
                    result.appendChild(createFlickrThumb(photoData))
                })
            })

        function createFlickrThumb(photoData) {
            // Create an element <a> and set attributes href and target
            var link = document.createElement('a');
            link.setAttribute('href', photoData.large);
            link.setAttribute('target', '_blank');

            // Create an element <img> and set attributes src and alt
            var image = document.createElement('img');
            image.setAttribute('src', photoData.thumb);
            image.setAttribute('alt', photoData.title);

            // Append <img> to <a>
            link.appendChild(image);

            return link;
        }

    })
})();


