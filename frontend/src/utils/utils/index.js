// import { SPOTIFY_URL } from "./constants";
const token = 'BQBpCAAtvQ_dNed9a-1whh5ZZ23NUDPKGbqbI2KM_8ZoAdbypOwTib6XiopbrBxOJueWVRsuAQl_f2TcJhPeoyoc6wL7cn8yJ44aZnzAIfunGAaJbBo'

export const getNewRealeases = async (limit = 40, offset = 0) => {
    try {
        const URL = `https://api.spotify.com/v1/browse/new-releases?limit=${limit}&offset=${offset}`;
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization:
                    `Bearer  ${token}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

// export const getArtists = async () => {
//     try {
//         const URL = 'https://api.spotify.com/v1/artists?ids=06HL4z0CvFAxyc27GXpf02,3TVXtAsR1Inumwj472S9r4,4oUHIQIBe0LHzYfvXNW4QM,2YZyLoL8N0Wb9xBt1NhZWg,6qqNVTkY8uBg9cP3Jd7DAH,40ZNYROS4zLfyyBSs2PGe2,1RyvyyTE3xzB2ZywiAwp0i,0Y5tJX1MQlPlqiwlOH1tJY,0iEtIxbK0KxaSlF7G42ZOp,246dkjvS1zLTtiykXe5h60,1Xyo4u8uXC1ZmMpatF05PJ,4q3ewBCX7sLwd24euuV69X,1URnnhqYAYcrqrcwql10ft,7dGJo4pcD2V6oG8kP0tJRR,7tYKF4w9nC0nq9CsPZTHyP,718COspgdWOnwOFpJHRZHS,74KM79TiuVKeVCqs8QtB0B,1VPmR4DJC1PlOtd0IADAO0,66CXWjxzNUsdJxJ2JdwvnR,12GqGscKJx3aE4t07u7eVZ,5pKCCKE2ajJHZ9KAiaK11H,4MCBfE4596Uoi2O4DtmEMz,2hlmm7s2ICUX0LVIhVFlZQ,5f7VJjfbwm532GiveGC0ZK,00FQb4jTyendYWaN8pK0wa'
//         const response = await fetch(URL, {
//             method: "GET",
//             headers: {
//                 Authorization:
//                     `Bearer  ${token}`,
//             },
//         });
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.log(error);
//     }
// };

// export const getAlbums = async () => {
//     try {
//         const URL = "https://api.spotify.com/v1/albums?ids=7aJuG4TFXa2hmE4z1yxc3n,1NAmidJlEaVgA3MpcPFYGq,5EYKrEDnKhhcNxGedaRQeK,3RQQmkQEvNCY4prGKE6oc5,4iqbFIdGOTzXeDtt9owjQn,18NOKLkZETa4sWwLMIm0UZ,6s84u2TUpR3wdUv4NgKA2j,6i7mF7whyRJuLJ4ogbH2wh,07w0rG5TETcyihsEIZR3qG,5quMTd5zeI9yW5UDua8wS4,168CdR21lfn0TTyw1Pkdcm,78bpIziExqiI9qztvNFlQu,3zu0hJJew2qXZNlselIQk8,5tSQtQGkrCJx3hoQxmLgfM,7txGsnDSqVMoRl6RQ9XyZP&market=ES"
//         const response = await fetch(URL, {
//             method: "GET",
//             headers: {
//                 Authorization:
//                     `Bearer  ${token}`,
//             },
//         });
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.log(error);
//     }
// };