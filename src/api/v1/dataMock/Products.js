const products = [
  {
    name: "Laptop Ceuta & Melilla gate Shawn Fuller ",
    image:
      "https://images.pexels.com/photos/811587/pexels-photo-811587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "sky football so explanation leader wonder late port hot older of darkness various negative wise journey knowledge pour parent moment aboard differ accident master hung Poland",
    price: 336,
    countInStock: 30,
    stock: 24,
    rating: 3,
    numReviews: 294,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Tanzania free Mason Hayes ",
    image:
      "https://img.freepik.com/premium-psd/close-up-floating-laptop-mockup_308775-7.jpg?w=996",
    description: "everywhere asleep hot rough window by attempt program somebody nature exclaimed run thumb organization make surrounded obtain mission certainly composed remain history early lose dangerous San Marino",
    price: 233,
    countInStock: 41,
    stock: 40,
    rating: 3,
    numReviews: 268,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Guyana useful Wayne Davidson ",
    image:
      "https://product.hstatic.net/200000722513/product/p-gaming-msi-cyborg-15-a12ucx-281vn-1_1fd42a15b9074364b13b885527e50d65_11d779943d56486f999028b5a4f0118d_master.png",
    description: "smooth else believed wealth do frame look allow typical difficult if best crew bound swung language sweet constantly improve bridge leaving division simple swam roof Nauru",
    price: 384,
    countInStock: 48,
    stock: 95,
    rating: 4,
    numReviews: 297,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Monaco yellow Ralph Pratt ",
    image:
      "https://product.hstatic.net/200000722513/product/g614ju-n3777w_7cffb8ddfb044c589ee1645408e5df68_master.png",
    description: "running lake size one should partly brain central been won mark growth paragraph exciting few triangle began managed climate pig member exchange because farther six Somalia",
    price: 573,
    countInStock: 10,
    stock: 98,
    rating: 4,
    numReviews: 261,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Kosovo fierce Jackson Barton ",
    image:
      "https://images.thinkgroup.vn/unsafe/1000x1000/https://media-api-beta.thinkpro.vn/media/core/products/2023/5/25/lg-gram-style-2023-14z90rs-gah54a5-thinkpro.jpg",
    description: "load dust gas soldier long rule journey while thee slight behavior question enemy pain nose bend outside ice mine iron putting stranger job hide nobody Timor-Leste",
    price: 514,
    countInStock: 40,
    stock: 97,
    rating: 4,
    numReviews: 284,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Anguilla shoulder Jeffery Walsh ",
    image:
      "https://bizweb.dktcdn.net/100/362/971/products/11438-dell-inspiron-14-5420-3.jpg?v=1686492300813",
    description: "size hold cattle shake refused combine with cow porch mixture map yourself bound news gun student whether hole habit riding smaller income lie could around Tunisia",
    price: 440,
    countInStock: 29,
    stock: 45,
    rating: 5,
    numReviews: 278,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Åland Islands zoo Chase Jacobs ",
    image:
      "https://images.unsplash.com/photo-1525373698358-041e3a460346?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
    description: "selection widely lay plane eat spring shall funny own pot brick proud planet fell courage mice wheel nearly slow citizen young very soft better chart Moldova",
    price: 377,
    countInStock: 27,
    stock: 27,
    rating: 4,
    numReviews: 296,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Guernsey beyond Sean Huff ",
    image:
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "burst lead his flower said toward tall on loss fellow deal past again lips mainly driving having food managed paragraph far primitive rabbit condition inch Rwanda",
    price: 419,
    countInStock: 30,
    stock: 88,
    rating: 4,
    numReviews: 293,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Lesotho easy Theresa Mills ",
    image:
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1551&q=80",
    description: "pull so slow us center tax news compare save let strike been what describe income small shot negative having quickly condition parent death exclaimed noun Haiti",
    price: 403,
    countInStock: 37,
    stock: 70,
    rating: 3,
    numReviews: 267,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Moldova unknown Daniel Harrison ",
    image:
      "https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "does fear metal today fallen somebody sign slipped watch huge agree wooden clean grandfather slabs build liquid down television grade been warn fight union shop Ceuta & Melilla",
    price: 386,
    countInStock: 33,
    stock: 20,
    rating: 3,
    numReviews: 298,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Latvia anyone Belle Bates ",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1168&q=80",
    description: "sing same follow sun pleasant bank both account carbon moment ahead feel sheet refer century whom point muscle in hair blood told face view amount Cyprus",
    price: 309,
    countInStock: 32,
    stock: 70,
    rating: 4,
    numReviews: 285,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Solomon Islands afternoon Ellen Logan ",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "similar railroad exist factory nodded near require kitchen hearing suppose field forth mean coming dawn rain fat swung value office lying size equipment object truck Antigua & Barbuda",
    price: 573,
    countInStock: 27,
    stock: 57,
    rating: 4,
    numReviews: 280,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Bahamas standard Michael Caldwell ",
    image:
      "https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    description: "some children military short act rice began outline mainly under upper scale make situation strip rubbed tool stretch cook look east fair studying bank reader Palau",
    price: 344,
    countInStock: 46,
    stock: 22,
    rating: 5,
    numReviews: 288,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop St. Pierre & Miquelon effect Alejandro Garner ",
    image:
      "https://plus.unsplash.com/premium_photo-1681702156223-ea59bfbf1065?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80",
    description: "off clothing appearance blind phrase composition else right desert flew most repeat alive kids strike include only toward level muscle heard sale breathe somewhere golden Finland",
    price: 538,
    countInStock: 10,
    stock: 46,
    rating: 3,
    numReviews: 273,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop French Guiana rain Sam Mann ",
    image:
      "https://images.unsplash.com/photo-1612425626229-632fab8bfc02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1758&q=80",
    description: "both leaf tie knew sides percent rear close quickly could fight earn chemical read quietly class advice size introduced environment large climb settle ought replace Solomon Islands",
    price: 568,
    countInStock: 45,
    stock: 61,
    rating: 3,
    numReviews: 266,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },  {
    name: "Laptop Albania sum Ray Kelly ",
    image:
      "https://images.pexels.com/photos/811587/pexels-photo-811587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "owner distance tape worse sail east welcome middle instrument contain combination result policeman fifteen knew hay aside seed deal doubt arrangement carry damage does eleven Gibraltar",
    price: 559,
    countInStock: 10,
    stock: 93,
    rating: 5,
    numReviews: 284,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Lesotho thin Micheal Martin ",
    image:
      "https://img.freepik.com/premium-psd/close-up-floating-laptop-mockup_308775-7.jpg?w=996",
    description: "discuss explanation volume student dry angle five save careful theory kids across behind improve contrast missing section draw stream atmosphere fact nose applied fought rhyme United Kingdom",
    price: 347,
    countInStock: 14,
    stock: 44,
    rating: 5,
    numReviews: 281,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Vanuatu blanket Jayden Payne ",
    image:
      "https://product.hstatic.net/200000722513/product/p-gaming-msi-cyborg-15-a12ucx-281vn-1_1fd42a15b9074364b13b885527e50d65_11d779943d56486f999028b5a4f0118d_master.png",
    description: "double clear stiff laugh goes keep song empty jet stared possibly yourself small largest different proper fireplace aside tape prize mostly burn average later making India",
    price: 588,
    countInStock: 16,
    stock: 80,
    rating: 4,
    numReviews: 295,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Somalia tone Nelle Burns ",
    image:
      "https://product.hstatic.net/200000722513/product/g614ju-n3777w_7cffb8ddfb044c589ee1645408e5df68_master.png",
    description: "characteristic folks far copy machine came shape border under correctly worry cutting diagram farther pass several sure eventually had pool wheat lack evidence characteristic earn Bulgaria",
    price: 406,
    countInStock: 30,
    stock: 37,
    rating: 5,
    numReviews: 272,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Guinea-Bissau came Mina Mullins ",
    image:
      "https://images.thinkgroup.vn/unsafe/1000x1000/https://media-api-beta.thinkpro.vn/media/core/products/2023/5/25/lg-gram-style-2023-14z90rs-gah54a5-thinkpro.jpg",
    description: "like funny aid greatly ask evidence prove fast neighborhood his separate energy piece public date seat somehow ran tape elephant cutting vast tiny human grandmother Mauritania",
    price: 344,
    countInStock: 13,
    stock: 42,
    rating: 4,
    numReviews: 294,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Iceland due Rosalie Massey ",
    image:
      "https://bizweb.dktcdn.net/100/362/971/products/11438-dell-inspiron-14-5420-3.jpg?v=1686492300813",
    description: "introduced help chair bread crowd thumb instrument vast sick swept pet stove pour forward wave boy atom known track fact out fellow torn brief key Martinique",
    price: 389,
    countInStock: 27,
    stock: 21,
    rating: 5,
    numReviews: 267,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Central African Republic direction Emilie Bowman ",
    image:
      "https://images.unsplash.com/photo-1525373698358-041e3a460346?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
    description: "cost ring stems grandmother rabbit swung slave because simplest movie young made bone smile science rich lake gradually frame already grass merely unhappy women immediately Mexico",
    price: 266,
    countInStock: 10,
    stock: 62,
    rating: 3,
    numReviews: 265,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Belgium handle Mario Matthews ",
    image:
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "shirt extra frighten six story broken aboard machine official wind slipped women sets rush warn night deer matter military relationship motor old problem must captured Diego Garcia",
    price: 598,
    countInStock: 16,
    stock: 20,
    rating: 4,
    numReviews: 270,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Greenland stronger Esther Hopkins ",
    image:
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1551&q=80",
    description: "chamber return steep pure circus sense son dust third different describe lucky paper sheet additional now old milk round mine least cannot search sunlight gentle Greenland",
    price: 572,
    countInStock: 17,
    stock: 73,
    rating: 5,
    numReviews: 265,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop São Tomé and Príncipe around Bess Schneider ",
    image:
      "https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "operation chose quiet behind please pig chemical border stick record lie chair flame up running family soon engine bet matter saw serious nest cutting everyone Guam",
    price: 469,
    countInStock: 16,
    stock: 85,
    rating: 4,
    numReviews: 272,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop St. Martin tell Joshua Fowler ",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1168&q=80",
    description: "truck across seeing had salt coach better himself right people school favorite belong topic prove element frame congress among tiny board worth equal poetry rays Poland",
    price: 271,
    countInStock: 41,
    stock: 47,
    rating: 3,
    numReviews: 288,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Zimbabwe master Virginia Nunez ",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "official vertical passage gasoline ought coat fifth increase eaten unit interest industry keep till wise tribe shoot more poetry threw cheese pound agree slowly attack Bolivia",
    price: 319,
    countInStock: 36,
    stock: 58,
    rating: 4,
    numReviews: 282,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Nepal broken Edna Adkins ",
    image:
      "https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    description: "language atmosphere moon specific oxygen owner locate free day board surprise angry later week riding taken gate making combine pan garage anyone change range mass Denmark",
    price: 306,
    countInStock: 31,
    stock: 25,
    rating: 5,
    numReviews: 264,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Cocos (Keeling) Islands given Olga Ramos ",
    image:
      "https://plus.unsplash.com/premium_photo-1681702156223-ea59bfbf1065?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80",
    description: "now must enjoy division present himself after box fall tin society key exciting handle told shake dig its shut toy her moment vegetable contrast minute Caribbean Netherlands",
    price: 231,
    countInStock: 15,
    stock: 49,
    rating: 5,
    numReviews: 286,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Czech Republic running Katherine Powell ",
    image:
      "https://images.unsplash.com/photo-1612425626229-632fab8bfc02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1758&q=80",
    description: "rabbit strip minute solution select dropped proper current thank since change snow catch tent judge pressure red explanation object area early bank changing meal card Monaco",
    price: 463,
    countInStock: 40,
    stock: 56,
    rating: 4,
    numReviews: 295,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },  {
    name: "Laptop South Georgia & South Sandwich Islands them Isabel Freeman ",
    image:
      "https://images.pexels.com/photos/811587/pexels-photo-811587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "row track three either soon discussion highest enter fourth police east joy rocky fat system attached layers once identity look wall grandmother weigh lot face Serbia",
    price: 284,
    countInStock: 38,
    stock: 86,
    rating: 4,
    numReviews: 261,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Albania mixture Craig Carroll ",
    image:
      "https://img.freepik.com/premium-psd/close-up-floating-laptop-mockup_308775-7.jpg?w=996",
    description: "tell forth method headed drink clothing report dollar length tape difficulty caught shallow generally current golden average memory magnet garage wagon mother tribe wheel hearing Tristan da Cunha",
    price: 491,
    countInStock: 24,
    stock: 32,
    rating: 4,
    numReviews: 268,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Latvia farmer Polly Ellis ",
    image:
      "https://product.hstatic.net/200000722513/product/p-gaming-msi-cyborg-15-a12ucx-281vn-1_1fd42a15b9074364b13b885527e50d65_11d779943d56486f999028b5a4f0118d_master.png",
    description: "how lion amount time clearly exact wealth desk spring we captured lower college key slabs enemy behavior discuss driving charge mysterious report battle sale composition Serbia",
    price: 363,
    countInStock: 44,
    stock: 43,
    rating: 4,
    numReviews: 275,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop United Arab Emirates buried Lewis Mathis ",
    image:
      "https://product.hstatic.net/200000722513/product/g614ju-n3777w_7cffb8ddfb044c589ee1645408e5df68_master.png",
    description: "contrast range term very seed shells escape sunlight church help cave known birds system relationship list regular ourselves slide stems music example plenty explore fear Djibouti",
    price: 348,
    countInStock: 16,
    stock: 47,
    rating: 4,
    numReviews: 289,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Honduras hide Estella Bush ",
    image:
      "https://images.thinkgroup.vn/unsafe/1000x1000/https://media-api-beta.thinkpro.vn/media/core/products/2023/5/25/lg-gram-style-2023-14z90rs-gah54a5-thinkpro.jpg",
    description: "forest some though many frighten children system soil couple rocky youth went lost should individual stared calm beneath swept route lake command name habit success Georgia",
    price: 217,
    countInStock: 36,
    stock: 47,
    rating: 5,
    numReviews: 264,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Philippines settle Clara Davis ",
    image:
      "https://bizweb.dktcdn.net/100/362/971/products/11438-dell-inspiron-14-5420-3.jpg?v=1686492300813",
    description: "forget circus construction shadow top zoo would known gather crew sum wrapped stage friend horn danger note shelter depend hundred tank case energy pony different Madagascar",
    price: 265,
    countInStock: 20,
    stock: 79,
    rating: 5,
    numReviews: 264,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Ceuta & Melilla toy Edna Hardy ",
    image:
      "https://images.unsplash.com/photo-1525373698358-041e3a460346?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
    description: "but level fish man crowd most standard duty farmer master matter gather camp do outer bag health pressure we globe are out salt question lack Nigeria",
    price: 256,
    countInStock: 46,
    stock: 60,
    rating: 4,
    numReviews: 267,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Montserrat tape Steven Rogers ",
    image:
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "managed directly capital does fourth station sweet exist disease crowd write brown far symbol shorter column division species environment very truth shells last chamber prepare Qatar",
    price: 208,
    countInStock: 47,
    stock: 44,
    rating: 3,
    numReviews: 266,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Peru shade Dora Franklin ",
    image:
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1551&q=80",
    description: "reader tall bank impossible school forty fish pool kill applied establish many saw clear be journey feel son strip friendly catch station substance needs mile Macedonia",
    price: 275,
    countInStock: 42,
    stock: 90,
    rating: 5,
    numReviews: 285,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Estonia magic Theresa Caldwell ",
    image:
      "https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "constantly heart bent saved buffalo heard palace sharp sit lead funny rocket operation ice something yard plural news clear simply statement tip deer say told Lebanon",
    price: 272,
    countInStock: 42,
    stock: 27,
    rating: 3,
    numReviews: 263,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Finland mountain Daniel Terry ",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1168&q=80",
    description: "wool hay range say excitement sound spin golden account sort globe sink away wherever bush land tube dance operation square joy unit wrote full primitive Brazil",
    price: 574,
    countInStock: 34,
    stock: 31,
    rating: 3,
    numReviews: 269,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Iceland willing Philip Flowers ",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "exchange next lake business importance pet seldom purpose shelf boat shoot rest phrase inch signal tears problem cage found mouse folks equipment fuel magic locate Angola",
    price: 242,
    countInStock: 35,
    stock: 24,
    rating: 3,
    numReviews: 275,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Ireland physical Eva Ramos ",
    image:
      "https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    description: "who many package dropped not without wool track tool might back they bigger list area doctor our pond company such lying equipment strike small exciting Haiti",
    price: 520,
    countInStock: 29,
    stock: 33,
    rating: 5,
    numReviews: 294,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Cameroon every Robert Newton ",
    image:
      "https://plus.unsplash.com/premium_photo-1681702156223-ea59bfbf1065?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80",
    description: "hour desert laugh little blind tide noise wonderful weak theory child activity needle fine seen carefully trick concerned anything partly science jack order knew lead South Georgia & South Sandwich Islands",
    price: 548,
    countInStock: 50,
    stock: 63,
    rating: 3,
    numReviews: 273,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
  {
    name: "Laptop Cambodia pictured Herbert Dawson ",
    image:
      "https://images.unsplash.com/photo-1612425626229-632fab8bfc02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1758&q=80",
    description: "list garden west beat operation anyway dog trip for bad wave against tube local fire swim board typical frame scientific sheet raise face lead cry South Sudan",
    price: 244,
    countInStock: 39,
    stock: 96,
    rating: 4,
    numReviews: 290,
    category: {
      name: "Gaming",
      brand: "ASUS",
    },
  },
];

module.exports = products;
