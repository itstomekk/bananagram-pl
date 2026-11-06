# Polski zestaw 144 płytek — druk 3D

Wariant **designerski**, przygotowany na Bambu Lab A1 i PLA. Cztery pliki STL są modelami 3D, **nie są gotowymi plikami do drukarki**: trzeba je najpierw pociąć w slicerze. Nie dołączono projektu 3MF ani G-code. Każdy STL wydrukuj **jeden raz**: 4 × 36 = 144 płytki. To autorski rozkład inspirowany polskim Scrabble, nie oficjalny rozkład Bananagrams.

## Pliki i wymiary

- `plyta-1-designerska.stl` … `plyta-4-designerska.stl` — cztery różne układy; otwieraj i drukuj osobno, po jednym razie.
- `rozklad.json` — liczba poszczególnych liter; `parametry.json` — wymiary i układ na płytach, wiersze liczone od dołu układu.
- Pojedyncza płytka: 20 × 20 mm, korpus 3,2 mm i wypukła litera 0,6 mm; wysokość łącznie 3,8 mm. Każdy układ ma około 130 × 130 mm, sąsiednie płytki dzieli 2 mm. Nominalny obszar roboczy A1 to 256 × 256 × 256 mm ([Bambu Lab](https://wiki.bambulab.com/en/a1/manual/faq)).

### Rozkład liter

A 13 · Ą 2 · B 3 · C 4 · Ć 2 · D 4 · E 10 · Ę 2 · F 2 · G 3 · H 3 · I 12 · J 3 · K 4 · L 4 · Ł 3 · M 4 · N 7 · Ń 2 · O 9 · Ó 2 · P 4 · R 6 · S 6 · Ś 2 · T 4 · U 3 · W 6 · Y 6 · Z 7 · Ź 1 · Ż 1. Razem 144; bez pustych płytek.

## Ustawienia początkowe w Bambu Studio

1. Wybierz drukarkę **Bambu Lab A1**, dyszę **0,4 mm**, używaną płytę stołu i profil swojego **PLA**. Nie wybieraj A1 mini ani innego materiału. Temperatury i chłodzenie zostaw według profilu filamentu i rzeczywistego stołu; dla PLA wskazówka Bambu to dysza około 210–220°C, lecz obowiązuje zakres producenta filamentu ([instrukcja A1](https://wiki.bambulab.com/en/a1/manual/intro-a1)).
2. Zaimportuj jeden STL w milimetrach, bez skalowania i bez obracania: płaskie spody na stole, litery do góry. Zachowaj układ wszystkich 36 płytek. Wycentruj całość na dostępnym polu; nie używaj druku „po obiektach”, jeśli slicer zgłasza kolizje. Wybierz druk warstwami całej płyty.
3. Zacznij od profilu warstwy **0,20 mm**, pierwsza warstwa również **0,20 mm**, wypełnienie **100%**, podpory **wyłączone**. To propozycja startowa, nie przetestowany profil ani gwarancja wydruku. Pozostałe prędkości, liczbę ścian i temperatury przyjmij z odpowiedniego profilu A1/PLA.
4. Potnij płytę i sprawdź podgląd każdej warstwy, zwłaszcza pierwszej, wypukłych liter oraz drobnych akcentów i kropek. Sprawdź komunikaty o kolizjach, obszarze wydruku i brakujących fragmentach. Dopiero wtedy wyeksportuj G-code dla swojej drukarki lub wyślij go z Bambu Studio.
5. Zalecany pierwszy test: skopiuj model do osobnego projektu, wybierz **Split → To Objects** (lub odpowiednik w używanej wersji), zostaw pojedynczo płytki z Ą oraz Ś i wydrukuj próbę. Nie nadpisuj plików STL. Sprawdź przyczepność, czytelność i trwałość znaków; następnie drukuj pełne układy.

### Przyczepność i podpory

Każdy STL zawiera 36 oddzielnych płytek, nie jedną połączoną kratkę. Każda musi osobno przykleić się do czystego stołu; obserwuj pierwszą warstwę i przerwij wydruk, jeśli choć jedna się odklei. Zacznij bez brimu. W razie odklejania popraw czystość stołu i ustawienia pierwszej warstwy. Brim można dodać, ale **przy odstępie 2 mm brimy sąsiadów mogą się połączyć**: sprawdź podgląd i usuń je po wydruku; ewentualnie wydrukuj mniej, szerzej rozstawionych płytek.

Kontrola siatek wykazała po 36 zamkniętych, spójnych brył na płytę; analiza ścian nie wykazała spodnich nawisów większych niż 45° poza dnem. Przekrój liter w Z=3,5 mm mieści się nad przekrojem korpusu w Z=3,19 mm. Także odseparowane wizualnie akcenty są częścią spójnej bryły płytki, a nie luźnymi elementami w powietrzu. To uzasadnia próbę **bez podpór**, ale analiza geometrii nie dowodzi wytrzymałości międzywarstwowej ani udanego wydruku; wykonaj próbę i obejrzyj podgląd slicera. Na narożnikach lub drobnych znakach jakość może zależeć od ustawień i filamentu.

### Opcjonalne dwa kolory

Wypukłe litery zaczynają się na wysokości Z=3,2 mm. Przy stałych warstwach 0,20 mm pierwsza warstwa liter powinna mieć górną wysokość **Z=3,40 mm**. Po cięciu znajdź ją w podglądzie i ustaw zmianę filamentu lub pauzę **przed rozpoczęciem tej warstwy**, zgodnie z funkcją swojej wersji Bambu Studio; sprawdź, że korpus ma już 3,2 mm, a cała pierwsza warstwa liter drukuje się nowym kolorem. Sama pauza nie zmienia automatycznie filamentu: postępuj zgodnie z instrukcją drukarki. Jeżeli rzeczywiste wysokości pierwszej lub kolejnych warstw są inne, wyznacz moment z podglądu, nie z numeru warstwy. Kontrast można też uzyskać przez pomalowanie wypukłych liter po wydruku.

**Bezpieczeństwo:** małe płytki mogą zostać połknięte; nie są przeznaczone dla małych dzieci.

## Stan weryfikacji

Cztery STL są kopiami wariantu designerskiego. Sprawdzono zgodność ich sum SHA-256 z plikami źródłowymi, wymiary, szczelność, spójność i liczbę brył, kąt nawisów oraz podparcie przekroju liter. Rozkład w układzie płyt zgadza się z `rozklad.json`. Bambu Studio nie zostało znalezione w standardowych lokalizacjach ani na liście zainstalowanych aplikacji na komputerze przygotowującym pliki, dlatego **nie wykonano cięcia ani wydruku testowego**. Czas, zużycie filamentu i zachowanie konkretnych akcentów w slicerze pozostają do sprawdzenia.
