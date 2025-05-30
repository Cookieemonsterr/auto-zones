(async () => {
  const response = await fetch("https://script.google.com/macros/s/AKfycby27NgXlenYSx_yDpGOzrBX4yCCtNvWHZE60wv5Wbt_U8sAu5MGnLGg0jyXayj1N6B9/exec");
  const zoneMap = await response.json();

  function setNativeValue(element, value) {
    const lastValue = element.value;
    element.value = value;
    const event = new Event("input", { bubbles: true });
    event.simulated = true;
    const tracker = element._valueTracker;
    if (tracker) tracker.setValue(lastValue);
    element.dispatchEvent(event);
  }

  async function humanTypeProperly(input, text) {
    input.focus();
    setNativeValue(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    for (let char of text) {
      const newValue = input.value + char;
      setNativeValue(input, newValue);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 60));
    }
  }

  async function openDropdownIfNeeded(input) {
    const selectWrapper = input.closest('.ant-select');
    if (selectWrapper) {
      selectWrapper.click();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  async function selectZone(zoneCode) {
    console.log(`🔎 Searching for zone: ${zoneCode}`);
    const input = document.querySelector('div.ant-select-selection-search input');
    if (!input) return console.error('❌ Input not found!');
    await openDropdownIfNeeded(input);
    await humanTypeProperly(input, zoneCode);
    await new Promise(r => setTimeout(r, 900));
    const options = Array.from(document.querySelectorAll('.ant-select-item-option-content'));
    const option = options.find(opt => opt.textContent.includes(zoneCode));
    if (option) {
      option.click();
      console.log(`✅ Added: ${zoneCode}`);
      await new Promise(r => setTimeout(r, 500));
    } else {
      console.error(`❌ Zone not found after typing: ${zoneCode}`);
    }
  }

  async function runSelection(zoneCodes) {
    for (let code of zoneCodes) {
      await selectZone(code);
      await new Promise(r => setTimeout(r, 600));
    }
    console.log('🎯 Done selecting all zonals!');
  }

  const zoneElements = document.querySelectorAll('#root .ant-select-selection-item[title]');
  const zoneElement = zoneElements.length > 1 ? zoneElements[1] : zoneElements[0];
  const zoneName = zoneElement?.getAttribute("title")?.trim();
  console.log("👉 Selected Zone:", zoneName);
  if (!zoneName || !zoneMap[zoneName]) return console.warn("⚠️ Zone not found in map or not selected yet.");
  await runSelection(zoneMap[zoneName]);
})();
