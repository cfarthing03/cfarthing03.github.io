Sinners Interactive World Map Pack V10
======================================

Map:
- Hilnem marker moved ever so slightly left from V9, intended to center over the N.

Sin profile city links:
- Added sin-city-links.js.
- It automatically turns each Sin profile's existing city relationship into real links:
    Pride -> Oro
    Greed -> Hilnem
    Lust -> Rushinghan
    Envy -> Etro
    Gluttony -> Hus
    Wrath -> Palin
    Sloth -> Sol
- It links the "Major City" fact.
- It links the existing city section heading.
- It adds an "Explore [City] ->" link at the bottom of that city's section.

The active sandbox contained the full current Lust and Pride HTML pages, so patched copies
of those are included in /patched-sin-pages/.

For the other five Sin pages, add this line immediately before </body>:
<script src="/sin-city-links.js"></script>

If /sin-city-links.js is loaded globally by your site's shared script/template, you do not need
to edit the five pages individually.
