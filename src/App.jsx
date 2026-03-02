
import './App.css'
import tapatias from "./assets/lasTapatias.jpg"
import losBetos from "./assets/losBetos.jpg"
import elLider from "./assets/elLider.jpg"
import melas from "./assets/melas.jpg"
import pinolero from "./assets/pinolero.jpg"
import tacosLimon from "./assets/TacosLimon.jpg"
import tacosTapatio from "./assets/TacosTapatio.jpg"
import aztlan from "./assets/Aztlan.jpg"
import guayacan from "./assets/Guayacan.jpg"
import acaTaco from "./assets/AcaTaco.jpg"
import Card from './components/Card'

function App() {
  return (
    <div className='whiteText'>
      <h1>Local Favorite Mexican Foods</h1>

      <div className='list-of-cards'>
        <Card
          image={tapatias}
          title={"Las Tapatias"}
          rating={"⭐⭐⭐⭐⭐"}
          info={"A community staple known for authentic Jalisco-style cooking. Famous for their birria, carnitas tacos, and handmade tortillas. Family-owned and operated with recipes passed down for generations."}
        />
        <Card
          image={losBetos}
          title={"Los Betos"}
          rating={"⭐⭐⭐⭐💫"}
          info={"A beloved Mexican fast-food spot famous for their enormous carne asada burritos and loaded fries. Known for quick service and generous portions at great prices. A go-to late-night spot."}
        />
        <Card
          image={elLider}
          title={"El Lider"}
          rating={"⭐⭐⭐⭐"}
          info={"A neighborhood favorite serving hearty, homestyle Mexican plates. Known for their pozole, enchiladas, and daily specials. Warm atmosphere with friendly staff that treats you like family."}
        />
        <Card
          image={melas}
          title={"Melas Restaurant"}
          rating={"⭐⭐⭐⭐⭐"}
          info={"A family-owned gem offering a wide menu of traditional Mexican dishes. Their carne asada and chile relleno are customer favorites. Known for fresh ingredients and generous servings at reasonable prices."}
        />
        <Card
          image={pinolero}
          title={"El Pinolero"}
          rating={"⭐⭐⭐⭐"}
          info={"A unique spot blending Nicaraguan and Mexican flavors. Must-tries include their gallo pinto, nacatamales, and classic tacos al pastor. A hidden gem that brings Central American culture to the table."}
        />
        <Card
          image={tacosLimon}
          title={"Tacos Limon"}
          rating={"⭐⭐⭐⭐⭐"}
          info={"Famous for their fresh street-style tacos topped with their signature lime seasoning. Offers a wide variety of meats including al pastor, carne asada, and lengua. Fast, flavorful, and always fresh."}
        />
        <Card
          image={tacosTapatio}
          title={"Tacos El Tapatio"}
          rating={"⭐⭐⭐⭐⭐"}
          info={"Authentic Jalisco-style taqueria with handmade corn tortillas and slow-cooked meats. Their birria tacos and consomé are a must. A true taste of Guadalajara with bold flavors and rich salsas."}
        />
        <Card
          image={aztlan}
          title={"Aztlan Grilled Taqueria"}
          rating={"⭐⭐⭐⭐"}
          info={"Specializing in grilled meats cooked over an open flame. Known for their juicy pollo asado, carne asada plates, and freshly grilled tacos. Great for those who love smoky, bold Mexican flavors."}
        />
        <Card
          image={guayacan}
          title={"El Guayacan"}
          rating={"⭐⭐⭐✨"}
          info={"A Latin-inspired restaurant serving a mix of Mexican and Central American dishes. Known for their seafood options, ceviche, and tropical-flavored drinks. A relaxed spot with a festive atmosphere."}
        />
        <Card
          image={acaTaco}
          title={"Aca Taco"}
          rating={"⭐⭐⭐⭐"}
          info={"A casual taco spot known for creative flavor combinations and fresh local ingredients. Their fish tacos and shrimp tacos are crowd favorites. A laid-back vibe perfect for a quick and tasty meal."}
        />
      </div>

    </div>
  )
}

export default App
