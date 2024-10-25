let cart = [];
    let prices = {
        'Gado-Gado': 8000,
        'Rujak Cocol': 10000,
        'Beras Kencur': 5000,
        'Sinom': 5000
    };

    // Update button dengan nama baru
    function addToCart(item) {
        const existingItem = cart.find(i => i.name === item);
        if (!existingItem) {
            cart.push({ name: item, quantity: 1 });
        } else {
            existingItem.quantity++;
        }
        updateCartCount();
        updateCartList();
        saveCart(); // Simpan ke localStorage
    }

    function updateCartCount() {
        document.getElementById('cart-count').innerText = cart.length;
    }

    function formatPrice(price) {
        if (price >= 1000) {
            return (price / 1000) + 'k';
        }
        return price;
    }

    function updateCartList() {
        const cartList = document.getElementById('cart-list');
        cartList.innerHTML = '';
        cart.forEach(item => {
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <p>${item.name}</p>
                <div class="flex items-center">
                    <button onclick="decreaseQuantity('${item.name}')" class="quantity-button">-</button>
                    <span class="quantity px-2 text-center w-8">${item.quantity}</span>
                    <button onclick="increaseQuantity('${item.name}')" class="quantity-button">+</button>
                </div>
                <p class="flex justify-center text-center w-16">${formatPrice(prices[item.name] * item.quantity)}</p>
                <button onclick="removeItem('${item.name}')" class="button-secondary">Hapus</button>
            `;
            cartList.appendChild(row);
        });
        updateTotalPrice();
    }

    function increaseQuantity(name) {
        const item = cart.find(i => i.name === name);
        if (item) {
            item.quantity++;
            updateCartList();
            saveCart(); // Simpan ke localStorage
        }
    }

    function decreaseQuantity(name) {
        const item = cart.find(i => i.name === name);
        if (item && item.quantity > 1) {
            item.quantity--;
        } else if (item && item.quantity === 1) {
            removeItem(name);
        }
        updateCartList();
        saveCart(); // Simpan ke localStorage
    }

    function removeItem(name) {
        const index = cart.findIndex(i => i.name === name);
        cart.splice(index, 1);
        updateCartCount();
        updateCartList();
        saveCart(); // Simpan ke localStorage
    }

    function updateTotalPrice() {
        const totalPrice = cart.reduce((acc, item) => acc + prices[item.name] * item.quantity, 0);
        document.getElementById('total-price').innerText = `Total Harga: ${formatPrice(totalPrice)}`;
        return totalPrice;
    }

    function checkout() {
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value; // Ambil pesan opsional
        if (name && cart.length > 0) {
            const totalPrice = updateTotalPrice();
            const productList = cart.map(item => `${item.name} x ${item.quantity}`).join('\n');
            let whatsappMessage = `Nama: ${name}\nProduk: ${productList}\nTotal: Rp ${totalPrice || 0}`;

            if (message) { // Tambahkan pesan jika ada
                whatsappMessage += `\nPesan untuk penjual: ${message}`;
            }

            const whatsappUrl = `https://wa.me/6282143455859?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        } else {
            alert('Silakan isi nama dan pilih produk terlebih dahulu');
        }
    }

    function closeCartWithoutRefresh() {
        const cartModal = document.getElementById('cart-modal');
        cartModal.classList.add('hidden'); 
    }

    function showCart() {
        const cartModal = document.getElementById('cart-modal');
        cartModal.classList.remove('hidden');
        updateCartList();
    }

    // Simpan keranjang ke localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Muat keranjang dari localStorage saat halaman dimuat
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartCount();
            updateCartList();
        }
    }

 // Fungsi untuk membuka modal deskripsi
function showDescription(description) {
    const modal = document.getElementById('description-modal');
    const descriptionText = document.getElementById('item-description');
    descriptionText.innerText = description;
    modal.classList.add('show'); // Tambahkan kelas 'show' untuk menampilkan modal
    modal.classList.remove('hidden');
}

// Fungsi untuk menutup modal deskripsi
function closeModal() {
    const modal = document.getElementById('description-modal');
    modal.classList.remove('show'); // Hapus kelas 'show' untuk menyembunyikan modal
    setTimeout(() => modal.classList.add('hidden'), 300); // Sembunyikan dengan delay
}


// Fungsi untuk menambahkan dan menghapus kelas animasi saat diklik
function animateButton(button) {
    button.classList.add('button-click'); // Tambahkan kelas animasi
    setTimeout(() => {
        button.classList.remove('button-click'); // Hapus setelah 100ms
    }, 100);
}
