(() => {
  const init = () => {
    $(document).ready(function () {
      /**************************************************** */
      // Elementleri oluştur
      const header = $("<div>");
      const headerContainer = $("<div>").hide(); // Başlangıçta gizli
      const headerHead = $("<h1>");
      const bodyContainer = $("<div>");
      const button = $("<button>");
      const input = $("<input>");
      const select = $("<select>");
      const count = $("<span>");
      const countPage = $("<span>");

      /**************************************************** */
      // HTML'in arka plan rengini ayarla ve body'yi temizle
      $("body").css("background-color", "#cdcdd3").empty();

      /**************************************************** */
      // Elementleri ekleme
      $("body").append(header, bodyContainer);
      header.append(headerHead, headerContainer);
      headerContainer.append(input, button, select, count, countPage);

      /**************************************************** */
      // Elementlere text ve HTML ekle
      select.html(`
                <option value="id">Sort by Id</option>
                <option value="name">Sort by Name</option>
            `);
      button.text("New Pokemons");
      headerHead.html("<b style='color: yellow;cursor:pointer'>POKEMONS</b>");
      /**************************************************** */
      // header slide olaylarını ayarla
      headerHead.on("click", function () {
        headerContainer.slideToggle(1000);
      });
      /**************************************************** */
      // Elementlere sınıf ekle
      button.addClass("button");
      input.addClass("input");
      header.addClass("header flex");
      headerContainer.addClass("header-container flex");
      select.addClass("select");
      bodyContainer.addClass("header flex");

      /************************************************ */
      // butona hover efeck
      $("button").hover(
        function () {
          $(this).addClass("scale");
        },
        function () {
          $(this).removeClass("scale");
        }
      );
      /************************************************ */
      //pokemon card yapısı
      const pokemonCard = ({ id, name, sprites, types }) => {
        return `<div class="card-container" data-name="${name.toLowerCase()}">
        <img class="pokemon-image" src="${sprites.front_default}"/>
        <p>${id}</p>
        <h3>${name}</h3>
        <p>${getPokemonTypes(types)}</p>
       
    </div>`;
      };
      /************************************************ */
      //API CALL

      let BASE_URL = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20"; //Başlangıç URL
      let allPokemonData = [];

      const getData = (url) => {
        $.getJSON(url, (data) => {
          count.text(`Total Pokemon: ${data.count}`);

          bodyContainer.empty(); // Önceki Pokémon'ları temizle yoksa değişmiyor
          allPokemonData = []; // Yeni veriler için temizle

          data.results.forEach(({ url }) => {
            $.getJSON(url, ({ name, id, sprites, types }) => {
              allPokemonData.push({ id, name, sprites, types });

              bodyContainer.append(pokemonCard({ name, id, sprites, types }));
            }).fail((error) => {
              console.error("Error fetching pokemon details:", error);
            });
          });
          BASE_URL = data.next; // clickte sonraki datalar için
          updateCountPage(); // sayfada bulunan pokemon sayısı için
        }).fail((error) => {
          console.error("Error fetching data:", error);
        });
      };

      /**************************************************** */
      // types kısmı için func
      const getPokemonTypes = (types) =>
        types.map((type) => `<span>${type.type.name}</span>`).join(",");

      /**************************************************** */
      // butona click ile yeni pokemonlar gelmesi
      button.on("click", () => {
        if (BASE_URL) {
          getData(BASE_URL);
        }
      });
      //inputta pokemon aramak için
      input.on("input", function () {
        const searchPoke = $(this).val().toLowerCase(); //input değerini al
        bodyContainer.empty();
        let filteredCount = 0;
        allPokemonData.forEach(({ id, name, sprites, types }) => {
          if (name.toLowerCase().includes(searchPoke)) {
            filteredCount++;
            bodyContainer.append(pokemonCard({ name, id, sprites, types }));
          }
        });
        if (filteredCount === 0) {
          bodyContainer.append("<h2>No content</h2>");
        }

        updateCountPage(filteredCount); // filtrelemede page pok. sayısını güncelliyor
      });
      // select kutusundan sıralama seçeneği ile sıralama değiştirme
      select.on("change", function () {
        const sortBy = $(this).val(); // seçilen değeri al
        sortPokemonData(sortBy);
      });

      const sortPokemonData = (sortBy) => {
        allPokemonData.sort((a, b) => {
          if (sortBy === "id") {
            return a.id - b.id;
          } else if (sortBy === "name") {
            return a.name.localeCompare(b.name); //a<b için olan string karş.
          }
        });

        bodyContainer.empty();
        allPokemonData.forEach(({ id, name, sprites, types }) => {
          bodyContainer.append(pokemonCard({ id, name, sprites, types }));
        });
        updateCountPage(allPokemonData.length);
      };
      // sayfada bulunan pokemon sayısı için
      const updateCountPage = (filteredCount = 20) => {
        const displayedCount =
          filteredCount !== null ? filteredCount : allPokemonData.length;
        countPage.text(`Page Pokemon: ${displayedCount}`);
      };

      // APICALL Fonksiyonu çağır
      getData(BASE_URL);

      /**************************************************** */
      // CSS stillerini ekle
      const styles = `
        .header {                 
          min-width: 700px;
          max-width: 700px;
          min-height: 100px;
          border-radius: 40px;
          margin: 24px auto;
          padding: 6px;
          background-color:#9e223f;
          
        }
        .flex {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-evenly;
          gap: 10px;
        }
        .button {
          border:none;         
          width: 140px;
          min-height: 40px;
          font-size: 14px;
          color: black;
          background-color: white;          
          border-radius: 10px;
          cursor: pointer;
        }
        .card-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: white;
          box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4);
          border-radius: 20px;
          width: 170px;
          height: 270px;
          padding: 8px;
          margin: 6px;
        }
        .card-container img {
          width: 150px;
          height: 150px;
        }
        .card-container p {
          font-size: large;
          font-style: italic;
          margin: 0;
        }
        .input {
          width: 200px;
          height: 32px;
          margin: 10px 0;
          margin-left: 40px;
          font-size: 14px;
        }
        .select {
          margin: 10px 0;
          margin-right: 40px;
          width: 200px;
          height: 32px;
        }
        .header-container.display {
          display: none;
        }
        span{
        font-size:1.2rem;
        }
        .scale{
        transform: scale(1.1); 
        transition: all .5s ease-in-out;
        background-color: inherit;
        color:white;
        border:2px solid;
        }  
      `;
      $("<style>").text(styles).appendTo("head");
    });
  };

  init();
})();
