const products = [
  {
    name: "Laptop William Jacobs across Denmark 4/23/2100",
    image:
      "https://images.pexels.com/photos/811587/pexels-photo-811587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "Netherlands subject actual should establish flame experience also sick sit tried helpful spent room nearby pocket light value hair silver score paint closer aloud thirty",
    price: 214,
    countInStock: 56,
    stock: 706,
    rating: 3,
    numReviews: 18,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Ernest Lawson smaller Madagascar 4/19/2120",
    image:
      "https://img.freepik.com/premium-psd/close-up-floating-laptop-mockup_308775-7.jpg?w=996",
    description: "Trinidad & Tobago seen greatest lungs phrase transportation moon nearby lion has lips herself sun fed lady remember fell care thing winter arrangement daily toward grew itself",
    price: 282,
    countInStock: 65,
    stock: 790,
    rating: 5,
    numReviews: 14,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Bryan Gardner railroad Iran 4/17/2100",
    image:
      "https://product.hstatic.net/200000722513/product/p-gaming-msi-cyborg-15-a12ucx-281vn-1_1fd42a15b9074364b13b885527e50d65_11d779943d56486f999028b5a4f0118d_master.png",
    description: "Tanzania rear perhaps thought tears man pick pack stuck till everywhere tank golden government locate team blue happened scale winter variety beyond cup situation liquid",
    price: 274,
    countInStock: 95,
    stock: 834,
    rating: 4,
    numReviews: 13,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Nettie Vasquez describe Central African Republic 4/10/2050",
    image:
      "https://product.hstatic.net/200000722513/product/g614ju-n3777w_7cffb8ddfb044c589ee1645408e5df68_master.png",
    description: "Uganda month scientific arm until state fish face fifty remain beyond mass swing failed cowboy one ranch perhaps corner single easy mistake consist swim darkness",
    price: 231,
    countInStock: 23,
    stock: 653,
    rating: 3,
    numReviews: 10,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Lucile Johnston close Guinea-Bissau 7/24/2069",
    image:
      "https://images.thinkgroup.vn/unsafe/1000x1000/https://media-api-beta.thinkpro.vn/media/core/products/2023/5/25/lg-gram-style-2023-14z90rs-gah54a5-thinkpro.jpg",
    description: "Niue wool swept wife fence soon paper cut smile think student one hold family produce gate itself connected held ready desk physical fed gold prevent",
    price: 272,
    countInStock: 26,
    stock: 921,
    rating: 3,
    numReviews: 18,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Polly Cox drink Sudan 10/19/2024",
    image:
      "https://bizweb.dktcdn.net/100/362/971/products/11438-dell-inspiron-14-5420-3.jpg?v=1686492300813",
    description: "Anguilla fifth development protection unit give rest include graph full identity scared cage somebody phrase began direction know built stranger life passage indicate on pitch",
    price: 250,
    countInStock: 60,
    stock: 578,
    rating: 4,
    numReviews: 20,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Russell Foster her Sudan 7/17/2067",
    image:
      "https://images.unsplash.com/photo-1525373698358-041e3a460346?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
    description: "Cape Verde tube realize behavior dot catch boy previous suggest women buried accident tax swim listen score run open reader everything wrote day stretch manner progress",
    price: 259,
    countInStock: 51,
    stock: 704,
    rating: 4,
    numReviews: 16,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Margaret Holland tower Ceuta & Melilla 9/18/2045",
    image:
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "Yemen seat medicine wise wash broken continent popular greatly area forward split size hidden fell worker habit saddle behavior basis team education willing having adjective",
    price: 277,
    countInStock: 98,
    stock: 508,
    rating: 4,
    numReviews: 16,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Amanda Moody save Anguilla 6/5/2068",
    image:
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1551&q=80",
    description: "Andorra extra volume shelf further figure grade letter dog hit proud enter secret tobacco motor whole sort former sugar without wagon pipe constantly lips growth",
    price: 236,
    countInStock: 21,
    stock: 860,
    rating: 3,
    numReviews: 20,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Lee Valdez see North Korea 3/1/2096",
    image:
      "https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "Jamaica eaten variety laid nest shore southern gold hidden class prepare level bicycle coat below repeat occasionally settlers growth danger honor positive member view double",
    price: 269,
    countInStock: 91,
    stock: 675,
    rating: 3,
    numReviews: 10,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Dora Collins cup Armenia 11/28/2103",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1168&q=80",
    description: "Benin slide hungry swing select consider lower in brick rise dry cave shelf everywhere art before wolf here generally further excitement baby frozen test train",
    price: 271,
    countInStock: 97,
    stock: 801,
    rating: 4,
    numReviews: 12,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Harvey Griffin met Ethiopia 1/25/2080",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "St. Vincent & Grenadines student pass easy look shine spin supply loud became beginning saved lucky mouse firm best beauty us box drove mood unit interior most lot",
    price: 281,
    countInStock: 20,
    stock: 537,
    rating: 5,
    numReviews: 10,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Tom Phelps quietly Singapore 4/20/2070",
    image:
      "https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    description: "South Georgia & South Sandwich Islands cattle send short between tea clock production become perhaps original laugh industrial level muscle mud beneath horn fox shape stop continent pattern happy yourself",
    price: 212,
    countInStock: 49,
    stock: 971,
    rating: 3,
    numReviews: 11,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Madge Holloway bill Canary Islands 3/7/2102",
    image:
      "https://plus.unsplash.com/premium_photo-1681702156223-ea59bfbf1065?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80",
    description: "Monaco doing late found gain result gravity somebody account they where develop writing contain rapidly evidence view sense father trap blew son substance send steel",
    price: 242,
    countInStock: 46,
    stock: 679,
    rating: 5,
    numReviews: 11,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Harriet Morton half Guadeloupe 1/10/2075",
    image:
      "https://images.unsplash.com/photo-1612425626229-632fab8bfc02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1758&q=80",
    description: "Zimbabwe either respect attached bright one heart walk bank facing pale badly carbon chain coal basic gun stronger airplane build sleep difficulty some dinner gate",
    price: 220,
    countInStock: 88,
    stock: 590,
    rating: 4,
    numReviews: 15,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
];

module.exports = products;
