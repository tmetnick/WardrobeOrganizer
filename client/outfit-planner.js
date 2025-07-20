document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const email = parseJwt(token).email;

  const grid = document.getElementById('clothing-grid');
  const selectedList = document.getElementById('selected-outfit');
  const categoryFilter = document.getElementById('category-filter');
  const saveOutfitBtn = document.getElementById('save-outfit');

  let allClothes = [];
  let selectedItems = [];

  // Fetch clothing
  const res = await fetch(`http://localhost:3000/api/clothes/user/${email}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  allClothes = await res.json();
  console.log('Fetched clothes:', allClothes);
  renderClothing(allClothes);

  // Render clothing grid
  function renderClothing(clothesList) {
    grid.innerHTML = '';
    const filtered = categoryFilter.value
      ? clothesList.filter(item => item.category.toLowerCase() === categoryFilter.value.toLowerCase())
      : clothesList;

    filtered.forEach(item => {
      const div = document.createElement('div');
      div.className = 'grid-item';
      div.innerHTML = `
        <img src="http://localhost:3000${item.imageUrl}" alt="${item.name}" style="width:100px;height:auto;"><br>
        ${item.name}
      `;
      div.onclick = () => toggleSelection(item);
      if (selectedItems.includes(item._id)) {
        div.style.border = '2px solid green';
      }
      grid.appendChild(div);
    });
  }

  // Toggle selection
  function toggleSelection(item) {
    const index = selectedItems.indexOf(item._id);
    if (index >= 0) {
      selectedItems.splice(index, 1);
    } else {
      selectedItems.push(item._id);
    }
    updateSelectedList();
    renderClothing(allClothes);
  }

  // Show selected outfit items
  function updateSelectedList() {
    selectedList.innerHTML = '';
    selectedItems.forEach(id => {
      const item = allClothes.find(c => c._id === id);
      const li = document.createElement('li');
      li.textContent = item.name;
      selectedList.appendChild(li);
    });
  }

  // Save outfit to backend
  saveOutfitBtn.addEventListener('click', async () => {
    const name = prompt('Give your outfit a name:');
    if (!name || selectedItems.length === 0) {
      alert('Please select at least one item and enter a name.');
      return;
    }

    const res = await fetch('/api/outfits/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        clothingItems: selectedItems
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Outfit saved!');
      selectedItems = [];
      updateSelectedList();
      renderClothing(allClothes);
      await loadPlannedOutfits(); // Load updated outfits after saving
    } else {
      alert('Failed to save outfit: ' + data.message);
    }
  });

  // Category filter
  categoryFilter.addEventListener('change', () => renderClothing(allClothes));

  // Load and display saved outfits
  async function loadPlannedOutfits() {
    const res = await fetch(`http://localhost:3000/api/outfits/user/${email}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const outfits = await res.json();
    console.log('Saved outfits:', outfits);

    const container = document.getElementById('planned-outfits');
    container.innerHTML = '';

    outfits.forEach(outfit => {
      const card = document.createElement('div');
      card.className = 'outfit-card';

      const title = document.createElement('h3');
      title.textContent = outfit.name;
      card.appendChild(title);

      const imgs = document.createElement('div');
      imgs.className = 'outfit-images';

      outfit.clothingItems.forEach(item => {
        const img = document.createElement('img');
        img.src = `http://localhost:3000${item.imageUrl}`;
        img.alt = item.name || 'clothing item';
        img.style.width = '80px';
        img.style.margin = '5px';
        imgs.appendChild(img);
      });

      card.appendChild(imgs);
      container.appendChild(card);
    });
  }

  await loadPlannedOutfits(); // Call when page loads
});

// Decode token to extract email
function parseJwt(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload;
}