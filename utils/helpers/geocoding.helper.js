const axios = require("axios");

const getCoordinatesFromNominatim = async (address) => {
    try {
        const encodedAddress = encodeURIComponent(address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;

        const response = await axios.get(url, {
            headers: {
                "User-Agent": "RouteManagementApp/1.0"
            }
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            return {
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon),
                formattedAddress: result.display_name
            };
        }

        return null;

    } catch (error) {
        console.error(`Error fetching coordinates for "${address}":`, error.message);
        return null;
    }
};

const getCoordinatesFromGoogle = async (address) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            console.error("Google Maps API key is not configured");
            return null;
        }

        const encodedAddress = encodeURIComponent(address);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

        const response = await axios.get(url);

        if (response.data.status === "OK" && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                latitude: location.lat,
                longitude: location.lng,
                formattedAddress: response.data.results[0].formatted_address
            };
        }

        return null;

    } catch (error) {
        console.error(`Error fetching coordinates for "${address}":`, error.message);
        return null;
    }
};

const getCoordinates = async (address) => {
    const provider = process.env.GEOCODING_PROVIDER || "nominatim";

    if (provider === "google") {
        return await getCoordinatesFromGoogle(address);
    }

    return await getCoordinatesFromNominatim(address);
};

const getCoordinatesForStoppages = async (stoppages) => {
    const results = [];
    const errors = [];
    const provider = process.env.GEOCODING_PROVIDER || "nominatim";

    for (let i = 0; i < stoppages.length; i++) {
        const stoppage = stoppages[i];

        if (provider === "nominatim" && i > 0) {
            await new Promise(resolve => setTimeout(resolve, 1100));
        }

        const coordinates = await getCoordinates(stoppage.stoppageName);

        if (coordinates) {
            results.push({
                ...stoppage,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                formattedAddress: coordinates.formattedAddress
            });
        } else {
            errors.push({
                index: i,
                stoppageName: stoppage.stoppageName,
                message: `Could not find coordinates for "${stoppage.stoppageName}"`
            });
        }
    }

    return { results, errors };
};

const validateUniqueSequenceOrders = (stoppages) => {
    const sequenceOrders = stoppages.map(s => s.sequenceOrder);
    const duplicates = [];
    const seen = new Set();

    for (const order of sequenceOrders) {
        if (seen.has(order)) {
            if (!duplicates.includes(order)) {
                duplicates.push(order);
            }
        } else {
            seen.add(order);
        }
    }

    return {
        isValid: duplicates.length === 0,
        duplicates
    };
};

module.exports = {
    getCoordinates,
    getCoordinatesForStoppages,
    validateUniqueSequenceOrders
};