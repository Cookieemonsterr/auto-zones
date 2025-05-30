(async () => {
  const response = await fetch("https://script.google.com/macros/s/AKfycby27NgXlenYSx_yDpGOzrBX4yCCtNvWHZE60wv5Wbt_U8sAu5MGnLGg0jyXayj1N6B9/exec");
  const zoneMap = await response.json();

  const normalize = str => str.replace(/[^\w\s]/gi, '').trim().toLowerCase();

  const zoneElements = document.querySelectorAll('#root .ant-select-selection-item[title]');
  const zoneElement = zoneElements.length > 1 ? zoneElements[1] : zoneElements[0];
  const zoneName = zoneElement?.getAttribute("title")?.trim();

  console.log("👉 Selected Zone:", zoneName);
  if (!zoneName || !zoneMap[zoneName]) {
    alert("⚠️ Zone not found in JSON data or not selected!");
    return;
  }

  const rawExpected = zoneMap[zoneName] || [];

  const expectedNames = [];
  const expectedCodes = [];

  for (let val of rawExpected) {
    if (typeof val === 'string' && /^\d{5}$/.test(val)) {
      expectedCodes.push(val.trim());
    } else {
      expectedNames.push(normalize(val));
    }
  }

  const selectedZoneTags = document.querySelectorAll('.ant-select-selection-item-content');
  const selectedNames = [];
  const selectedCodes = [];

  Array.from(selectedZoneTags).forEach(el => {
    const full = el.textContent;

    const codeMatch = full.match(/\((\d{5})\)/);
    if (codeMatch) selectedCodes.push(codeMatch[1]);

    const parts = full.split('-');
    const namePart = parts[parts.length - 1].replace(/\(\d+\)/, '').trim();
    if (namePart) selectedNames.push(normalize(namePart));
  });

  const missingNames = expectedNames.filter(n => !selectedNames.includes(n));
  const missingCodes = expectedCodes.filter(c => !selectedCodes.includes(c));
  const missing = [...missingNames, ...missingCodes].filter(Boolean);

  if (missing.length === 0) {
    alert(`✅ All zones for "${zoneName}" are selected!`);
  } else {
    console.log("❌ Missing Names:", missingNames);
    console.log("❌ Missing Codes:", missingCodes);
    prompt(`⚠️ Missing zones for "${zoneName}":\n\n(Copy below)`, missing.join(', '));
  }
})();
