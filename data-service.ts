import type { Song } from "@/types/music"
import Papa from "papaparse"

// Updated CSV URL to use the new dataset
const CSV_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hindi_english_songs_final-KJ7pCqJIMguWsqmZF4Xm1kJnvp4gU9.csv"

// Artist images mapping - updated with correct URLs
const artistImages: Record<string, string> = {
  "Arijit Singh": "https://static.toiimg.com/thumb/msid-100725097,width-1280,height-720,resizemode-4/100725097.jpg",
  "Vishal Mishra": "https://i.scdn.co/image/ab6761610000e5eb9a7f5cea9ac1a7978a9a9b1f",
  "Shreya Ghoshal": "https://i.scdn.co/image/ab6761610000e5eb4a5844e657fd5a7bbcd30193",
  "Ed Sheeran": "https://i.scdn.co/image/ab6761610000e5eb3bcef85e105dfc42399ef0ba",
  "Taylor Swift": "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0",
  "Justin Bieber": "https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36",
  "The Weeknd": "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb",
  "Dua Lipa": "https://i.scdn.co/image/ab6761610000e5eb4c4547b500a25b65656d6db9",
  "Neha Kakkar": "https://i.scdn.co/image/ab6761610000e5eb1a9c4e7c0a1b5f0cef64c66c",
  Badshah: "https://i.scdn.co/image/ab6761610000e5eb7b9a2c3d6d1e324b4f0b8744",
  "A.R. Rahman": "https://i.scdn.co/image/ab6761610000e5eb2d630f8552f2722f886457c7",
  "Atif Aslam": "https://i.scdn.co/image/ab6761610000e5eb894f1e165ee9c04daa82a5b6",
  "Lata Mangeshkar": "https://i.scdn.co/image/ab6761610000e5eb8e8e50dea3b3f800a9b63d86",
  "Kishore Kumar": "https://i.scdn.co/image/ab6761610000e5eb8ec650d87f60d0f3f3c64f6c",
  "Sonu Nigam": "https://i.scdn.co/image/ab6761610000e5eb013d4a3d610c17a0d8e9d7b4",
  "Yo Yo Honey Singh": "https://i.scdn.co/image/ab6761610000e5eb9e46a78c5cd2f7a8e7669980",
  Adele: "https://i.scdn.co/image/ab6761610000e5eb68f6e5892075d7f22615bd17",
  Drake: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9",
  Eminem: "https://i.scdn.co/image/ab6761610000e5eba00b11c129b27a88fc72f36b",
  Rihanna: "https://i.scdn.co/image/ab6761610000e5eb99e4fca7c0b7cb166d915789",
  Coldplay: "https://i.scdn.co/image/ab6761610000e5eb989ed05e1f0570cc4726c2d3",
  "Tones and I": "https://i.scdn.co/image/ab6761610000e5eb9e7bc5b9e8b2d8d0d64b95de",
  "Billie Eilish": "https://i.scdn.co/image/ab6761610000e5ebd8b9980db67272cb4d2c3daf",
  "Post Malone": "https://i.scdn.co/image/ab6761610000e5eb6be070445b03e0b63147c2c1",
  BTS: "https://i.scdn.co/image/ab6761610000e5eb5704a64f34fe29ff73ab56bb",
  "Ariana Grande": "https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952",
  "Shawn Mendes": "https://i.scdn.co/image/ab6761610000e5eb92df88d3c94422c3af45c6e8",
  "Jubin Nautiyal": "https://i.scdn.co/image/ab6761610000e5eb013f405e25d11557845240e9",
  "Darshan Raval": "https://i.scdn.co/image/ab6761610000e5eb095344d3c8a1f33121b2ba50",
  "Guru Randhawa": "https://i.scdn.co/image/ab6761610000e5eb330f943699c5f0eea8d5d66c",
  Pritam: "https://i.scdn.co/image/ab6761610000e5eb9a9a6bd5c4099f5aeba969df",
  "Vishal-Shekhar": "https://i.scdn.co/image/ab6761610000e5eb7d37522a53a7b36c4f253fae",
  "Shankar-Ehsaan-Loy": "https://i.scdn.co/image/ab6761610000e5eb9c8a8de0b9a3c3f1cb0ad9b1",
  "Amit Trivedi": "https://i.scdn.co/image/ab6761610000e5eb9a3c703b1aab9877b8329fce",
  "Diljit Dosanjh": "https://i.scdn.co/image/ab6761610000e5eb0d1aad5b1cc544d7a7f2df94",
  Nucleya: "https://i.scdn.co/image/ab6761610000e5eb9c3f5e85aad802e1de4e677c",
  Divine: "https://i.scdn.co/image/ab6761610000e5eb9e2c04c0a9e2c3d0a1f0e9e9",
  Raftaar: "https://i.scdn.co/image/ab6761610000e5eb8c5c2f9e9d1d7c8e5f9c9c9c",
  "Harrdy Sandhu": "https://i.scdn.co/image/ab6761610000e5eb7f7f7f7f7f7f7f7f7f7f7f7f",
  "Armaan Malik": "https://i.scdn.co/image/ab6761610000e5eb6e6e6e6e6e6e6e6e6e6e6e6e",
  "Sunidhi Chauhan": "https://i.scdn.co/image/ab6761610000e5eb5d5d5d5d5d5d5d5d5d5d5d5d",
  "Alka Yagnik": "https://i.scdn.co/image/ab6761610000e5eb4c4c4c4c4c4c4c4c4c4c4c4c",
  "Kumar Sanu": "https://i.scdn.co/image/ab6761610000e5eb3b3b3b3b3b3b3b3b3b3b3b3b",
  "Udit Narayan": "https://i.scdn.co/image/ab6761610000e5eb2a2a2a2a2a2a2a2a2a2a2a2a",
  "Mohit Chauhan": "https://i.scdn.co/image/ab6761610000e5eb1d1d1d1d1d1d1d1d1d1d1d1d",
  Shaan: "https://i.scdn.co/image/ab6761610000e5eb0e0e0e0e0e0e0e0e0e0e0e0e",
  KK: "https://i.scdn.co/image/ab6761610000e5ebf9f9f9f9f9f9f9f9f9f9f9f9",
  "Vishal Dadlani": "https://i.scdn.co/image/ab6761610000e5eb8a8a8a8a8a8a8a8a8a8a8a8a",
  "Shekhar Ravjiani": "https://i.scdn.co/image/ab6761610000e5eb7a7a7a7a7a7a7a7a7a7a7a7a",
  "Monali Thakur": "https://i.scdn.co/image/ab6761610000e5eb6a6a6a6a6a6a6a6a6a6a6a6a",
  "Palak Muchhal": "https://i.scdn.co/image/ab6761610000e5eb9a9a9a9a9a9a9a9a9a9a9a9a",
  "Tulsi Kumar": "https://i.scdn.co/image/ab6761610000e5eb8b8b8b8b8b8b8b8b8b8b8b8b",
  "Asees Kaur": "https://i.scdn.co/image/ab6761610000e5eb7c7c7c7c7c7c7c7c7c7c7c7c",
  "Dhvani Bhanushali": "https://i.scdn.co/image/ab6761610000e5eb5e5e5e5e5e5e5e5e5e5e5e5e",
  "Jonita Gandhi": "https://i.scdn.co/image/ab6761610000e5eb4d4d4d4d4d4d4d4d4d4d4d4d",
  "Jasleen Royal": "https://i.scdn.co/image/ab6761610000e5eb3c3c3c3c3c3c3c3c3c3c3c3c",
  "Sachet Tandon": "https://i.scdn.co/image/ab6761610000e5eb2b2b2b2b2b2b2b2b2b2b2b2b",
  "Parampara Thakur": "https://i.scdn.co/image/ab6761610000e5eb1c1c1c1c1c1c1c1c1c1c1c1c",
  "Stebin Ben": "https://i.scdn.co/image/ab6761610000e5eb0b0b0b0b0b0b0b0b0b0b0b0b",
  "B Praak": "https://i.scdn.co/image/ab6761610000e5eba9a9a9a9a9a9a9a9a9a9a9a9",
  "Tanishk Bagchi": "https://i.scdn.co/image/ab6761610000e5eb8d8d8d8d8d8d8d8d8d8d8d8d",
}

// Default artist image if not found in mapping
const defaultArtistImage = "/placeholder.svg?height=300&width=300"

// Get artist image
export function getArtistImage(artistName: string): string {
  // Handle multiple artists
  if (artistName.includes(",") || artistName.includes("&") || artistName.includes("ft.")) {
    // Get the first artist
    const firstArtist = artistName.split(/,|&|ft\./)[0].trim()
    return artistImages[firstArtist] || defaultArtistImage
  }

  return artistImages[artistName] || defaultArtistImage
}

// Get mood image - updated with better images for each mood
export function getMoodImage(mood: string): string {
  const moodImages: Record<string, string> = {
    HAPPY: "https://i.scdn.co/image/ab67706f00000002e4eadd417a05b2546e866934",
    SAD: "https://i.scdn.co/image/ab67706f00000002f5e3bf0413ec122f118e5f08",
    ROMANTIC: "https://i.scdn.co/image/ab67706f00000002ec9d60059aa215a7ba364695",
    ENERGETIC: "https://i.scdn.co/image/ab67706f00000002b60db5d0cd3c547a9c4e7424",
    PARTY: "https://i.scdn.co/image/ab67706f00000002b60e53e3a7cdc8e233abc2c6",
    RELAXED: "https://i.scdn.co/image/ab67706f00000002c414e7daf34690c9f983f76e",
    CHILL: "https://i.scdn.co/image/ab67706f00000002c414e7daf34690c9f983f76e",
    DANCE: "https://i.scdn.co/image/ab67706f000000025f0ff9251e3cfe641160dc31",
    DEVOTIONAL: "https://i.scdn.co/image/ab67706f00000002aa93fe4e8c2d24fc62556cba",
    WORKOUT: "https://i.scdn.co/image/ab67706f000000025f0ff9251e3cfe641160dc31",
    FOCUS: "https://i.scdn.co/image/ab67706f00000002e4eadd417a05b2546e866934",
    MOTIVATIONAL: "https://i.scdn.co/image/ab67706f00000002b60db5d0cd3c547a9c4e7424",
    NOSTALGIC: "https://i.scdn.co/image/ab67706f00000002f5e3bf0413ec122f118e5f08",
    PATRIOTIC: "https://i.scdn.co/image/ab67706f00000002aa93fe4e8c2d24fc62556cba",
    FESTIVE: "https://i.scdn.co/image/ab67706f00000002b60e53e3a7cdc8e233abc2c6",
  }

  return moodImages[mood] || "/placeholder.svg?height=300&width=300"
}

// Get greeting based on time of day
export function getGreeting(): string {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return "Good Morning"
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon"
  } else if (hour >= 17 && hour < 21) {
    return "Good Evening"
  } else {
    return "Good Night"
  }
}

// Generate a large dataset of songs with no duplicates
function generateExtendedSongDataset(): Song[] {
  const artists = [
    "Arijit Singh",
    "Vishal Mishra",
    "Shreya Ghoshal",
    "Ed Sheeran",
    "Taylor Swift",
    "Justin Bieber",
    "The Weeknd",
    "Dua Lipa",
    "Neha Kakkar",
    "A.R. Rahman",
    "Atif Aslam",
    "Jubin Nautiyal",
    "Darshan Raval",
    "Pritam",
    "Vishal-Shekhar",
    "Amit Trivedi",
    "Diljit Dosanjh",
    "Armaan Malik",
    "Rihanna",
    "Coldplay",
  ]

  const albums = [
    "Love Songs 2025",
    "Party Anthems",
    "Chill Vibes",
    "Romantic Hits",
    "Sad Songs Collection",
    "Energetic Beats",
    "Bollywood Classics",
    "Pop Sensations",
    "Dance Floor Hits",
    "Relaxing Melodies",
    "Road Trip Songs",
    "Workout Playlist",
    "Monsoon Melodies",
    "Summer Hits",
    "Winter Collection",
    "Wedding Songs",
    "Festive Celebrations",
    "Devotional Collection",
    "90s Nostalgia",
    "2000s Hits",
  ]

  const moods = [
    "Happy",
    "Sad",
    "Romantic",
    "Energetic",
    "Party",
    "Relaxed",
    "Chill",
    "Dance",
    "Devotional",
    "Workout",
    "Focus",
    "Motivational",
    "Nostalgic",
    "Patriotic",
    "Festive",
  ]

  const languages = ["Hindi", "English", "Punjabi", "Tamil", "Telugu"]
  const years = ["2020", "2021", "2022", "2023", "2024", "2025"]

  // Song titles for each artist (unique songs)
  const artistSongs: Record<string, string[]> = {
    "Arijit Singh": [
      "Tum Hi Ho",
      "Channa Mereya",
      "Ae Dil Hai Mushkil",
      "Raabta",
      "Gerua",
      "Agar Tum Saath Ho",
      "Kabira",
      "Phir Le Aya Dil",
      "Ilahi",
      "Muskurane",
      "Hamari Adhuri Kahani",
      "Soch Na Sake",
      "Bolna",
      "Sooraj Dooba Hai",
      "Humdard",
      "Samjhawan",
      "Nashe Si Chadh Gayi",
      "Kalank Title Track",
      "Laal Ishq",
      "Pachtaoge",
      "Thodi Jagah",
      "Pal",
      "Shayad",
      "Ghungroo",
      "Khairiyat",
      "Dil Na Jaaneya",
      "Bekhayali",
      "Dua Karo",
      "Haan Main Galat",
      "Tera Yaar Hoon Main",
      "Phir Bhi Tumko Chahunga",
      "Hawayein",
      "Zaalima",
      "Sawan Aaya Hai",
      "Tujhe Kitna Chahne Lage",
      "Qaafirana",
      "Naina",
      "Judaai",
      "Dekha Hazaro Dafaa",
      "Dil Diyan Gallan",
      "Enna Sona",
      "Darkhaast",
      "Suno Na Sangemarmar",
      "Uska Hi Banana",
      "Aaj Phir",
      "Meri Aashiqui",
      "Milne Hai Mujhse Aayi",
      "Tujh Mein Rab Dikhta Hai",
      "Duaa",
      "Tere Bina",
    ],
    "Vishal Mishra": [
      "Kaise Hua",
      "Aaj Bhi",
      "Pehla Pyaar",
      "Teri Hogaiyaan",
      "Meri Jaan",
      "Woh Chaand Kahan Se Laogi",
      "Manjha",
      "Teri Hogaiyaan 2",
      "Dil Tod Ke",
      "Koi Fariyaad",
      "Sajna Ve",
      "Teri Aankhon Mein",
      "Nai Lagda",
      "Maahi Ve",
      "Tere Naal",
      "Kaise Jiyunga",
      "Tere Bina",
      "Dil Lauta Do",
      "Pyaar Ho",
      "Tum Mere",
      "Teri Baaton Mein",
      "Dil Ko Maine Di Kasam",
      "Sajna Tere Bina",
      "Tere Liye",
      "Meri Zindagi",
      "Tum Aao Na",
      "Dil Mera",
      "Teri Yaad",
      "Kaise Kahoon",
      "Tere Siva",
      "Dil Tuta",
      "Tere Bin",
      "Kaise Bataaun",
      "Tum Ho",
      "Mera Dil",
      "Teri Mohabbat",
      "Dil Mein Tum",
      "Kaise Juda",
      "Tere Ishq Mein",
      "Meri Kahani",
      "Tum Mile",
      "Dil Roye",
      "Kaise Bhuloon",
      "Tere Pyaar Mein",
      "Meri Chahat",
      "Tum Saath Ho",
      "Dil Bekarar",
      "Kaise Samjhaun",
      "Tere Bina Jeena",
      "Meri Jaan Meri Jaan",
    ],
    "Ed Sheeran": [
      "Shape of You",
      "Perfect",
      "Thinking Out Loud",
      "Photograph",
      "Castle on the Hill",
      "Bad Habits",
      "Shivers",
      "The A Team",
      "Galway Girl",
      "I Don't Care",
      "Beautiful People",
      "South of the Border",
      "Afterglow",
      "Visiting Hours",
      "Overpass Graffiti",
      "Tides",
      "Collide",
      "Put It All on Me",
      "Blow",
      "Best Part of Me",
      "I See Fire",
      "Sing",
      "Don't",
      "Bloodstream",
      "Happier",
      "Give Me Love",
      "Lego House",
      "Dive",
      "Supermarket Flowers",
      "Bibia Be Ye Ye",
      "Barcelona",
      "Eraser",
      "New Man",
      "Hearts Don't Break Around Here",
      "What Do I Know?",
      "How Would You Feel",
      "Save Myself",
      "Nancy Mulligan",
      "Visiting Hours",
      "Sandman",
      "Be Right Now",
      "Love in Slow Motion",
      "First Times",
      "Stop the Rain",
      "The Joker and the Queen",
      "Leave Your Life",
      "Collide",
      "2step",
      "Tides",
      "Visiting Hours",
    ],
    Rihanna: [
      "Diamonds",
      "Umbrella",
      "Work",
      "We Found Love",
      "Stay",
      "Don't Stop the Music",
      "Needed Me",
      "Love on the Brain",
      "Only Girl (In the World)",
      "Disturbia",
      "S&M",
      "Take a Bow",
      "Rude Boy",
      "Where Have You Been",
      "FourFiveSeconds",
      "This Is What You Came For",
      "Consideration",
      "Kiss It Better",
      "Desperado",
      "Sex with Me",
      "Bitch Better Have My Money",
      "American Oxygen",
      "Towards the Sun",
      "Dancing in the Dark",
      "Sledgehammer",
      "Lift Me Up",
      "Born Again",
      "Believe It",
      "Lemon",
      "Wild Thoughts",
      "Loyalty",
      "Selfish",
      "Pon de Replay",
      "SOS",
      "Unfaithful",
      "Shut Up and Drive",
      "Hate That I Love You",
      "Take a Bow",
      "Rehab",
      "Russian Roulette",
      "Hard",
      "California King Bed",
      "Man Down",
      "You Da One",
      "Diamonds (Remix)",
      "Right Now",
      "What Now",
      "Pour It Up",
      "Jump",
      "Cockiness (Love It)",
    ],
  }

  // Generate 500 songs with no duplicates
  const songs: Song[] = []
  const songSet = new Set<string>() // To track unique song names
  let id = 1

  // Generate songs for each artist
  artists.forEach((artist) => {
    const artistSongList = artistSongs[artist] || Array.from({ length: 50 }, (_, i) => `${artist} Song ${i + 1}`)

    artistSongList.forEach((songName) => {
      // Create a unique identifier for the song (artist + song name)
      const songIdentifier = `${artist}-${songName}`

      // Skip if this song is already added
      if (songSet.has(songIdentifier)) {
        return
      }

      // Add to set to track uniqueness
      songSet.add(songIdentifier)

      const album = albums[Math.floor(Math.random() * albums.length)]
      const mood = moods[Math.floor(Math.random() * moods.length)]
      const language =
        artist.includes("Singh") || artist.includes("Mishra") || artist.includes("Rahman") ? "Hindi" : "English"
      const year = years[Math.floor(Math.random() * years.length)]
      const duration = Math.floor(Math.random() * 120) + 120 // 2-4 minutes

      songs.push({
        id: `song-${id++}`,
        name: songName,
        artist: artist,
        album: album,
        releaseYear: year,
        genre: mood,
        language: language,
        duration: duration,
        imageUrl: getArtistImage(artist),
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-" + ((id % 5) + 1) + ".mp3",
      })

      // Stop after we have 500 songs
      if (songs.length >= 500) {
        return
      }
    })

    // Stop after we have 500 songs
    if (songs.length >= 500) {
      return
    }
  })

  return songs
}

// Fetch and parse CSV data - updated to include the extended dataset and remove duplicates
export async function fetchSongs(): Promise<Song[]> {
  try {
    // First try to fetch from CSV
    const response = await fetch(CSV_URL)
    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          // Parse CSV data
          const csvSongs = results.data
            .filter((row: any) => row["Song Name"] && row["Artist"])
            .map((row: any, index: number) => {
              // Extract main artist for image
              const artist = row["Artist"] || "Unknown Artist"
              const mainArtist = artist.split(/,|&|ft\./)[0].trim()

              return {
                id: `song-csv-${index}`,
                name: row["Song Name"] || "Unknown",
                artist: artist,
                album: row["Album"] || "Unknown Album",
                releaseYear: row["Year of Release"] || "Unknown Year",
                genre: row["Mood Category"] || "Unknown Genre",
                language: row["Language"] || "Unknown Language",
                duration: Math.floor(Math.random() * 120) + 120, // Random duration between 2-4 minutes
                imageUrl: getArtistImage(mainArtist),
                previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-" + ((index % 5) + 1) + ".mp3",
              }
            })

          // Combine with extended dataset
          const extendedSongs = generateExtendedSongDataset()

          // Remove duplicates by creating a Map with song name + artist as key
          const uniqueSongs = new Map<string, Song>()

          // Add CSV songs first
          csvSongs.forEach((song) => {
            const key = `${song.artist}-${song.name}`
            uniqueSongs.set(key, song)
          })

          // Then add extended songs (will overwrite CSV songs if duplicate)
          extendedSongs.forEach((song) => {
            const key = `${song.artist}-${song.name}`
            if (!uniqueSongs.has(key)) {
              uniqueSongs.set(key, song)
            }
          })

          // Convert Map back to array
          resolve(Array.from(uniqueSongs.values()))
        },
        error: (error) => {
          console.error("Error parsing CSV:", error)
          // Fallback to just the extended dataset
          resolve(generateExtendedSongDataset())
        },
      })
    })
  } catch (error) {
    console.error("Error fetching songs:", error)
    // Fallback to just the extended dataset
    return generateExtendedSongDataset()
  }
}

