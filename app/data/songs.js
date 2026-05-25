// [START]
      let Songs = [
    {
        "id": "0",
        "name": "Sunroof",
        "artist": "Ben Plum, Stayer & Dream Chaos",
        "banner": "Sunroof.jpg",
        "url": "Ben Plum, Stayer & Dream Chaos - Sunroof.mp3",
        "duration": "2:27"
    },
    {
        "id": "1",
        "name": "I Aint Worried",
        "artist": "Besomage, Lookin, PACANI",
        "banner": "I Aint Worried.jpeg",
        "url": "Besomage, Lookin, PACANI - I Aint Worried.mp3",
        "duration": "2:36"
    },
    {
        "id": "2",
        "name": "BIRDS OF A FEATHER",
        "artist": "Billie Eilish",
        "banner": "Birds of A Feather.jpg",
        "url": "Billie Eilish - BIRDS OF A FEATHER.mp3",
        "duration": "3:30"
    },
    {
        "id": "3",
        "name": "Lovely",
        "artist": "Billie Eilish",
        "banner": "Lovely.png",
        "url": "Billie Eilish - Lovely.mp3",
        "duration": "3:24"
    },
    {
        "id": "4",
        "name": "1985",
        "artist": "Bo Burnham",
        "banner": "1985.jpg",
        "url": "Bo Burnham - 1985.mp3",
        "duration": "2:26"
    },
    {
        "id": "5",
        "name": "Living Life, In The Night",
        "artist": "Cheriimoya ft. Sierra Kidd",
        "banner": "Living Life, In The Night.jpg",
        "url": "Cheriimoya ft. Sierra Kidd - Living Life, In The Night.mp3",
        "duration": "2:02"
    },
    {
        "id": "6",
        "name": "I Really Want to Stay at Your House",
        "artist": "CyberPunk 2077 ft. Rosa Walton & Hallie Coggins",
        "banner": "I Really Want To Stay At Your House.png",
        "url": "CyberPunk 2077 ft. Rosa Walton & Hallie Coggins - I Really Want to Stay at Your House.mp3",
        "duration": "4:06"
    },
    {
        "id": "7",
        "name": "Mask",
        "artist": "Dream",
        "banner": "Mask.jpg",
        "url": "Dream - Mask.mp3",
        "duration": "2:53"
    },
    {
        "id": "8",
        "name": "Slow Down",
        "artist": "Dream",
        "banner": "Slow Down.jpeg",
        "url": "Dream - Slow Down.mp3",
        "duration": "2:34"
    },
    {
        "id": "9",
        "name": "Where Are You Now",
        "artist": "Dream Chaos, Ben Plum",
        "banner": "Where are you Now.jpg",
        "url": "Dream Chaos, Ben Plum - Where Are You Now.mp3",
        "duration": "2:17"
    },
    {
        "id": "10",
        "name": "MIDDLE OF THE NIGHT",
        "artist": "Elley Duhé",
        "banner": "Middle of the Night.jpeg",
        "url": "Elley Duhé - MIDDLE OF THE NIGHT.mp3",
        "duration": "3:06"
    },
    {
        "id": "11",
        "name": "Heat Waves",
        "artist": "Glass Animals",
        "banner": "Heat Waves.png",
        "url": "Glass Animals - Heat Waves.mp3",
        "duration": "3:58"
    },
    {
        "id": "12",
        "name": "somewhere only we know",
        "artist": "Gustixa & Rhianne",
        "banner": "Somewhere Only We Know.jpg",
        "url": "Gustixa & Rhianne - somewhere only we know.mp3",
        "duration": "3:04"
    },
    {
        "id": "13",
        "name": "Hope Is the Thing With Feathers",
        "artist": "HOYO-MiX ft. Chevy",
        "banner": "Hope Is The Thing With Feathers.png",
        "url": "HOYO-MiX ft. Chevy - Hope Is the Thing With Feathers.mp3",
        "duration": "2:55"
    },
    {
        "id": "14",
        "name": "Blazing Heart",
        "artist": "HOYO-MiX ft. Chrissy Costanza",
        "banner": "Blazing Heart.png",
        "url": "HOYO-MiX ft. Chrissy Costanza - Blazing Heart.mp3",
        "duration": "2:57"
    },
    {
        "id": "15",
        "name": "Passing Memories",
        "artist": "HOYO-MiX ft. Faouzia",
        "banner": "Passing Memories.jpg",
        "url": "HOYO-MiX ft. Faouzia - Passing Memories.mp3",
        "duration": "3:39"
    },
    {
        "id": "16",
        "name": "Columbina's Lullaby",
        "artist": "HOYO-MiX ft. Shania Yan",
        "banner": "Columbina's Lullaby.png",
        "url": "HOYO-MiX ft. Shania Yan - Columbina's Lullaby.mp3",
        "duration": "2:11"
    },
    {
        "id": "17",
        "name": "Star Odyssey",
        "artist": "HOYO-MiX ft.Airi Suzuki",
        "banner": "Star Odyssey.png",
        "url": "HOYO-MiX ft.Airi Suzuki - Star Odyssey.mp3",
        "duration": "3:13"
    },
    {
        "id": "18",
        "name": "Right Now",
        "artist": "Harddope, Rovack, J R",
        "banner": "Right Now.jpg",
        "url": "Harddope, Rovack, J R - Right Now.mp3",
        "duration": "2:53"
    },
    {
        "id": "19",
        "name": "Demons",
        "artist": "Imagine Dragons",
        "banner": "Demons.jpg",
        "url": "Imagine Dragons- Demons.mp3",
        "duration": "2:57"
    },
    {
        "id": "20",
        "name": "LOVE STORY",
        "artist": "Indila",
        "banner": "Love Story.jpg",
        "url": "Indila - LOVE STORY.mp3",
        "duration": "4:33"
    },
    {
        "id": "21",
        "name": "golden hour",
        "artist": "JVKE",
        "banner": "Golden Hour.png",
        "url": "JVKE - golden hour.mp3",
        "duration": "3:51"
    },
    {
        "id": "22",
        "name": "Infinity",
        "artist": "Jaymes Young",
        "banner": "Infinity.jpg",
        "url": "Jaymes Young-Infinity.mp3",
        "duration": "3:57"
    },
    {
        "id": "23",
        "name": "Summertime Sadness",
        "artist": "Lana Del Rey",
        "banner": "Summertime Sadness.png",
        "url": "Lana Del Rey - Summertime Sadness.mp3",
        "duration": "4:24"
    },
    {
        "id": "24",
        "name": "Where We Started",
        "artist": "Lost Sky ft. Jex",
        "banner": "Music.png",
        "url": "Lost Sky ft. Jex - Where We Started.mp3",
        "duration": "3:42"
    },
    {
        "id": "25",
        "name": "Dreams pt. II",
        "artist": "Lost Sky ft. Sara Skinner",
        "banner": "Dreams pt. II.jpeg",
        "url": "Lost Sky ft. Sara Skinner - Dreams pt. II.mp3",
        "duration": "3:35"
    },
    {
        "id": "26",
        "name": "Overboard",
        "artist": "Madds Buckley",
        "banner": "Overboard.png",
        "url": "Madds Buckley - Overboard.mp3",
        "duration": "3:12"
    },
    {
        "id": "27",
        "name": "Summertime",
        "artist": "Maggie ft. Nyan",
        "banner": "Summertime.jpg",
        "url": "Maggie ft. Nyan - Summertime.mp3",
        "duration": "2:33"
    },
    {
        "id": "28",
        "name": "All In",
        "artist": "Marino",
        "banner": "All in.jpeg",
        "url": "Marino - All In.mp3",
        "duration": "2:03"
    },
    {
        "id": "29",
        "name": "The Lost Soul Down",
        "artist": "NBSPL",
        "banner": "The Lost Soul Down.jpeg",
        "url": "NBSPL - The Lost Soul Down.mp3",
        "duration": "4:01"
    },
    {
        "id": "30",
        "name": "Grateful",
        "artist": "NEFFEX",
        "banner": "Grateful.png",
        "url": "NEFFEX - Grateful.mp3",
        "duration": "3:02"
    },
    {
        "id": "31",
        "name": "GODS",
        "artist": "Newjeans",
        "banner": "Gods.jpeg",
        "url": "Newjeans - GODS.mp3",
        "duration": "3:36"
    },
    {
        "id": "32",
        "name": "My Heart Full Of Flames",
        "artist": "PUBG",
        "banner": "My Heart Full of Flames.png",
        "url": "PUBG - My Heart Full Of Flames.mp3",
        "duration": "3:03"
    },
    {
        "id": "33",
        "name": "Break It Off",
        "artist": "Pink Pantheress",
        "banner": "Break It Off.png",
        "url": "Pink Pantheress - Break It Off.mp3",
        "duration": "1:35"
    },
    {
        "id": "34",
        "name": "Sunflower",
        "artist": "Post Malone, Swae Lee",
        "banner": "Sunflower.png",
        "url": "Post Malone, Swae Lee - Sunflower.mp3",
        "duration": "2:41"
    },
    {
        "id": "35",
        "name": "You are Not Alone",
        "artist": "Saosin",
        "banner": "You are Not alone.jpg",
        "url": "Saosin - You are Not Alone.mp3",
        "duration": "3:58"
    },
    {
        "id": "36",
        "name": "Freaks",
        "artist": "Surf Curse",
        "banner": "Freaks.jpg",
        "url": "Surf Curse - Freaks.mp3",
        "duration": "2:27"
    },
    {
        "id": "37",
        "name": "Cruel Summer",
        "artist": "Taylor Swift",
        "banner": "Cruel Summer.jpeg",
        "url": "Taylor Swift - Cruel Summer.mp3",
        "duration": "2:59"
    },
    {
        "id": "38",
        "name": "Keep It To Yourself",
        "artist": "ThxSoMch",
        "banner": "Keep it to yourself.jpeg",
        "url": "ThxSoMch - Keep It To Yourself.mp3",
        "duration": "2:40"
    },
    {
        "id": "39",
        "name": "threwitallaway!",
        "artist": "Vxlious",
        "banner": "threwitallaway!.png",
        "url": "Vxlious - threwitallaway! .mp3",
        "duration": "2:04"
    },
    {
        "id": "40",
        "name": "See You Again",
        "artist": "Wiz Khalifa ft. Charlie Puth",
        "banner": "Music.png",
        "url": "Wiz Khalifa ft. Charlie Puth - See You Again.mp3",
        "duration": "3:57"
    },
    {
        "id": "41",
        "name": "Unfaithful",
        "artist": "Yohan Gerber",
        "banner": "Music.png",
        "url": "Yohan Gerber - Unfaithful.mp3",
        "duration": "2:33"
    },
    {
        "id": "42",
        "name": "did i tell u that i miss u",
        "artist": "adore",
        "banner": "Music.png",
        "url": "adore -  did i tell u that i miss u.mp3",
        "duration": "1:55"
    },
    {
        "id": "43",
        "name": "i walk this earth all by myself",
        "artist": "Unknown",
        "banner": "Music.png",
        "url": "i walk this earth all by myself.mp3",
        "duration": "2:25"
    },
    {
        "id": "44",
        "name": "MoeChakkaFire",
        "artist": "issey",
        "banner": "MoeChakkaFire.png",
        "url": "issey - MoeChakkaFire.mp3",
        "duration": "2:36"
    },
    {
        "id": "45",
        "name": "SEVENTH HEAVEN",
        "artist": "milet",
        "banner": "Music.png",
        "url": "milet - SEVENTH HEAVEN.mp3",
        "duration": "3:57"
    },
    {
        "id": "46",
        "name": "Please",
        "artist": "wiv",
        "banner": "Please.png",
        "url": "wiv - Please.mp3",
        "duration": "2:06"
    }
];
      // [END]

export default Songs;
