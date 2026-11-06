# Bananagram

Niezależna polska gra słowna inspirowana Bananagrams. Graj solo albo w pokoju dla 2–4 osób. Zestaw ma 144 płytki zgodne z projektowym rozkładem liter.

## Uruchomienie

Potrzebny jest Node.js. W katalogu `docs` uruchom:

```sh
node server.js
```

Otwórz `http://localhost:8080/`. Port można zmienić zmienną środowiskową `PORT`. Gra solo działa także po udostępnieniu samych plików statycznych; pokoje wymagają działającego serwera Node. Sam GitHub Pages lub inny hosting statyczny **nie zapewnia multiplayera**.

Aby grać z inną osobą, obie muszą otworzyć ten sam adres serwera dostępny z ich urządzeń (np. adres komputera w tej samej sieci lokalnej). `localhost` na telefonie oznacza telefon, nie komputer gospodarza. Do gry przez internet trzeba samodzielnie uruchomić serwer pod dostępnym publicznie adresem i dodać HTTPS przez bezpieczny serwer pośredniczący; ten projekt nie zawiera hostingu ani konfiguracji HTTPS. Gospodarz tworzy pokój, wysyła kod lub link i uruchamia grę po dołączeniu pozostałych.

## Zasady przyjęte w tej wersji

1. Każdy otrzymuje 21 płytek; gra przebiega równocześnie, każdy na swojej planszy 15 × 15. Wybierz płytkę i dotknij pola; dotknięcie położonej litery zwraca ją do ręki.
2. Układaj jedną połączoną krzyżówkę z polskich słów poziomo i pionowo. Ułożenie można dowolnie przebudowywać. Na telefonie plansza przewija się poziomo.
3. Gdy ręka jest pusta i wszystkie litery są połączone bokami, kliknij „Gotowe!”. Każdy gracz dostaje po jednej płytce, o ile wystarcza ich wszystkim.
4. Gdy w puli pozostało mniej płytek niż graczy, pierwsza osoba, która spełni powyższy warunek i kliknie „Gotowe!”, wygrywa. W solo trzeba wyczerpać pulę.
5. **Program nie ma słownika ani kontroli poprawności słów**; sprawdza tylko połączenie płytek i pustą rękę. Gracze muszą uzgodnić poprawność słów poza aplikacją. Nie ma obecnie widoku cudzej planszy — do sprawdzenia należy pokazać ją drugiej osobie osobno. Nie ma wymiany płytek.

## Ograniczenia pokoi

Serwer jest prostym prototypem dla zaufanych graczy, nie usługą produkcyjną: pokoje i partie istnieją tylko w pamięci procesu i znikają po restarcie, nie ma limitowania żądań ani mechanizmu usuwania nieaktywnych pokoi. Nie uruchamiaj go publicznie bez odpowiedniego zabezpieczenia i nadzoru. Bez HTTPS połączenia są jawne. Serwer wysyła stan całej partii do uczestników; ręce, pula i plansze nie są tajne przed innymi graczami ani operatorem. Bilet gracza jest w `sessionStorage` i jest przesyłany w żądaniach; nie udostępniaj go. Odświeżenie tej samej karty przywraca sesję, ale utrata karty lub wybranie „Wyjdź” nie zwalnia miejsca, a opuszczony gospodarz nie jest automatycznie zastępowany. W takich przypadkach utwórz nowy pokój.

Zapis solo znajduje się w pamięci przeglądarki (`localStorage`). Czcionki mogą być pobierane z Google Fonts; bez dostępu działają czcionki zastępcze.

## Testy

Z katalogu głównego repozytorium:

```sh
node test/logic.test.js
node test/server.test.js
python test/browser_test.py
```

Ostatni test wymaga Pythona, Playwrighta i zainstalowanej przeglądarki Chrome; uruchamia lokalny serwer, dwa odizolowane konteksty oraz sprawdza ruchy w obu kierunkach, odświeżenie, solo i szerokość telefonu. Zrzuty trafiają do lokalnego katalogu scratch środowiska testowego.
