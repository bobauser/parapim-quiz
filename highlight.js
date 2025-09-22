function highlighter(sourceText, targetText) {
    const stopWords = new Set(['og', 'ikke', 'men', 'er', 'en', 'et', 'den', 'det', 'som']); // utvid denne listen etter behov
    const highlightClass = 'highlight';

    // Funksjon for å rense tekst for tegnsetting og gjøre alt til små bokstaver
    function cleanText(text) {
        return text.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s{2,}/g, " ");
    }

    // Deler sourceText inn i ord og renser
    const sourceWords = cleanText(sourceText).split(' ');

    // Finner unike ord fra sourceText som ikke er stoppord
    const uniqueWords = sourceWords.filter(word => !stopWords.has(word) && word.trim().length > 1);

    // Escape RegEx spesialtegn i ord for å unngå feil i replace-funksjonen
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Lager en RegEx for hvert unikt ord og erstatter det i targetText med en highlight
    uniqueWords.forEach(word => {
        const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
        targetText = targetText.replace(regex, (match) => `<span class="${highlightClass}">${match}</span>`);
    });

    return targetText;
}

// CSS for highlight class
// .highlight {
//     background-color: yellow; /* eller en annen farge du ønsker */
//     display: inline; /* for å unngå å bryte teksten inn i flere linjer */
// }
