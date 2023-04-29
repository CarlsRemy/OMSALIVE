/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
function initMap() {
	const bounds = new google.maps.LatLngBounds();
	const markersArray = [];
	const map = new google.maps.Map(document.getElementById("map"), {
		center: {lat: 19.472856977725773, lng:  -70.69266546175004 },
		zoom: 10,
	});
	// initialize services
	const geocoder = new google.maps.Geocoder();
	const service = new google.maps.DistanceMatrixService();
	// build request
	const origin1 = {lat:  19.472856977725773, lng:  -70.69266546175004}; 
	//const origin2 = "Greenwich, England"; // londre
	const destinationA = {lat: 19.469792024960867, lng: -70.68708648010643};
	//const destinationB = { lat: 50.087, lng: 14.421 };

	const request = {
		origins: [origin1],
		destinations: [destinationA],
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.METRIC,
		avoidHighways: false,
		avoidTolls: false,
	};




	// get distance matrix response
	service.getDistanceMatrix(request).then((response) => {

		console.table(response)
	
		// show on map
		const originList = response.originAddresses;
		const destinationList = response.destinationAddresses;

		deleteMarkers(markersArray);

		const showGeocodedAddressOnMap = (asDestination) => {
			const handler = ({ results }) => {
				map.fitBounds(bounds.extend(results[0].geometry.location));
				markersArray.push(
					new google.maps.Marker({
						map,
						position: results[0].geometry.location,
						label: asDestination ? "D" : "O",
					})
				);
			};
			return handler;
		};

		for (let i = 0; i < originList.length; i++) {
			const results = response.rows[i].elements;

			geocoder
				.geocode({ address: originList[i] })
				.then(showGeocodedAddressOnMap(false));

			for (let j = 0; j < results.length; j++) {
				geocoder
					.geocode({ address: destinationList[j] })
					.then(showGeocodedAddressOnMap(true));
			}
		}
	});
}

function deleteMarkers(markersArray) {
	for (let i = 0; i < markersArray.length; i++) {
		markersArray[i].setMap(null);
	}

	markersArray = [];
}

window.initMap = initMap;