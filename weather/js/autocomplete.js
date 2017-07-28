var autocomplete;

autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */ (
        document.getElementById('autocomplete')), {
        types: ['(cities)']
    });