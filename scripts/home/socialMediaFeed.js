// const Embedo = require("embedo");

// window.onload = function() {
//   console.log("start");
//   var embedo = new Embedo({
//     facebook: {
//       version: "v2.10",
//       appId: "1191864160977852",
//       xfbml: true
//     },
//     twitter: true,
//     instagram: true
//   });

//   // Loads tweet
//   embedo
//     .load(
//       document.getElementById("embedo-twitter"),
//       "https://twitter.com/COOPAleWorks/status/1118559895165571072"
//     )
//     .done(function() {
//       console.log("Tweet Loaded. [hide loader if/any]");
//     });

//   // // Loads twitter timeline grid
//   // embedo.load(
//   //   document.getElementById("embedo-twitter-grid"),
//   //   "https://twitter.com/TwitterDev/timelines/539487832448843776",
//   //   {
//   //     widget_type: "grid"
//   //   }
//   // );

//   // // Loads twitter timeline
//   // embedo.load(
//   //   document.getElementById("embedo-twitter-timeline"),
//   //   "https://twitter.com/COOPAleWorks",
//   //   {
//   //     height: 500
//   //   }
//   // );

//   // embedo.load(
//   //   document.getElementById("embedo-gist"),
//   //   "https://gist.github.com/brandonb927/4149074.js",
//   //   {
//   //     frameborder: 0
//   //   }
//   // );

//   // embedo.load(
//   //   document.getElementById("embedo-codepen"),
//   //   "https:////codepen.io/PavelDoGreat/embed/zdWzEL/?height=265&theme-id=0&default-tab=js,result&embed-version=2"
//   // );

//   // // Multiple URLs
//   // embedo.load(
//   //   document.getElementById("embedo-multiple"),
//   //   [
//   //     "https://www.instagram.com/p/BX3fMnRjHpZ",
//   //     "https://www.instagram.com/p/BX3ejdJHmkD",
//   //     "https://www.instagram.com/p/BX3VEDqFvmg"
//   //   ],
//   //   {
//   //     hidecaption: false
//   //   }
//   // );

//   // // Loads facebook post
//   // embedo
//   //   .load(
//   //     document.getElementById("embedo-facebook"),
//   //     "https://www.facebook.com/9gag/posts/10156278718151840",
//   //     {}
//   //   )
//   //   .done(function() {
//   //     console.log("Facebook Loaded. [hide loader if/any]");
//   //   })
//   //   .fail(function(err) {
//   //     console.warn("Facebook embed issue:", err);
//   //   });

//   // Loads instagram photo
//   embedo.load(
//     document.getElementById("embedo-instagram"),
//     "https://www.instagram.com/p/BwXOa-8h0E3/",
//     {
//       hidecaption: false
//     }
//   );

//   // Test Element Watch Events
//   embedo.on("watch", function(result) {
//     console.log("Embedo watch", result);
//   });

//   embedo.on("refresh", function(request, data) {
//     console.log("Embedo refresh", request, data);
//   });

//   embedo.on("destroy", function() {
//     console.log("Embedo destroy");
//   });

//   embedo.on("error", function(error) {
//     console.error("Embedo error", error);
//   });

//   console.log("finished");
// };
