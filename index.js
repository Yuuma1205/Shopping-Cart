let carts = document.querySelectorAll(".add-cart");
let products = [
    {
        name: "Hawaiian Shirt 1",
        tag: "hawaiianshirt1",
        price: 15,
        inCart: 0
    },
    {
        name: "Hawaiian Shirt 2",
        tag: "hawaiianshirt2",
        price: 20,
        inCart: 0
    },
    {
        name: "Hawaiian Shirt 3",
        tag: "hawaiianshirt3",
        price: 20,
        inCart: 0
    },
    {
        name: "Hawaiian Shirt 4",
        tag: "hawaiianshirt4",
        price: 25,
        inCart: 0
    },
    {
        name: "Hawaiian Shirt 5",
        tag: "hawaiianshirt5",
        price: 30,
        inCart: 0
    }
];

for (let i=0; i<carts.length; i++) {
    carts[i].addEventListener("click", () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    })
}

function onloadCartNumbers() {
    let productNumbers = localStorage.getItem("cartNumbers");
    if (productNumbers) {
        document.querySelector(".cart span").textContent = productNumbers;
    }
}

function cartNumbers(product) {
    let productNumbers = localStorage.getItem("cartNumbers");
    productNumbers = parseInt(productNumbers);

    if (productNumbers) {
        localStorage.setItem("cartNumbers", productNumbers + 1);
        document.querySelector(".cart span").textContent = productNumbers +1;
    } else {
        localStorage.setItem("cartNumbers", 1);
        document.querySelector(".cart span").textContent = 1;
    }

    setItems(product);
}

function setItems(product) {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);

    if (cartItems != null) {

        if (cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag] : product
            }
        }
        cartItems[product.tag].inCart +=1;
    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag] : product
        }
    }
    
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product) {
    console.log("The product price is ", product.price);
    let cartCost = localStorage.getItem("totalCost");
    

    if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost + product.price);
    } else {
        localStorage.setItem("totalCost", product.price);
    }
}

function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector
    (".products");
    let cartCost = localStorage.getItem("totalCost");

    if (cartItems && productContainer) {
        productContainer.innerHTML = "";
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
            <div class="product">
                <ion-icon name="close-outline"></ion-icon>
                <img src="./images/${item.tag}.jpg">
                <span>${item.name}</span>
                <div class="price">$${item.price},00</div>
                <div class="quantity">
                    <ion-icon class="decrease"
                    name="chevron-back-circle-outline"></ion-icon>
                    <span>${item.inCart}</span>
                    <ion-icon class="increase"
                    name="chevron-forward-circle-outline"></ion-icon>
                </div>
                <div class="total">
                    $${item.inCart * item.price},00
                </div>
            </div>
            `;
        });

        productContainer.innerHTML += `
        <div class="basketTotalContainer">
            <h4 class="basketTotalTitle">
                Basket Total
            </h4>
            <h4 class="basketTotal">
                $${cartCost},00
            </h4>
        </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.querySelector(".products");

    // 增加商品數量
    function increaseQuantity(itemTag) {
        let cartItems = JSON.parse(localStorage.getItem("productsInCart"));
        cartItems[itemTag].inCart += 1;
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));
        updateCartNumbers(1);
        updateCartCost();
        updateCartDisplay();
    }

    // 減少商品數量
    function decreaseQuantity(itemTag) {
        let cartItems = JSON.parse(localStorage.getItem("productsInCart"));
        if (cartItems[itemTag].inCart > 1) {
            cartItems[itemTag].inCart -= 1;
            localStorage.setItem("productsInCart", JSON.stringify(cartItems));
            updateCartNumbers(-1);
            updateCartCost();
            updateCartDisplay();
        }
    }

    // 刪除商品
    function removeItem(itemTag) {
        let cartItems = JSON.parse(localStorage.getItem("productsInCart"));
        let cartCost = localStorage.getItem("totalCost");
        let productCount = cartItems[itemTag].inCart;

        cartCost = parseInt(cartCost) - (cartItems[itemTag].price * productCount);
        localStorage.setItem("totalCost", cartCost);

        delete cartItems[itemTag];
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));

        updateCartNumbers(-productCount);
        updateCartDisplay();
    }

    // 更新購物車商品數量
    function updateCartNumbers(change) {
        let productNumbers = localStorage.getItem("cartNumbers");
        productNumbers = parseInt(productNumbers);

        if (productNumbers) {
            let newProductNumbers = productNumbers + change;
            if (newProductNumbers <= 0) {
                localStorage.setItem("cartNumbers", 0);
                document.querySelector(".cart span").textContent = 0;
            } else {
                localStorage.setItem("cartNumbers", newProductNumbers);
                document.querySelector(".cart span").textContent = newProductNumbers;
            }
        } else {
            localStorage.setItem("cartNumbers", 0);
            document.querySelector(".cart span").textContent = 0;
        }
    }

    // 更新購物車總金額
    function updateCartCost() {
        let cartItems = JSON.parse(localStorage.getItem("productsInCart"));
        let totalCost = 0;

        Object.values(cartItems).forEach(item => {
            totalCost += item.price * item.inCart;
        });

        localStorage.setItem("totalCost", totalCost);
    }

    // 更新購物車顯示
    function updateCartDisplay() {
        let cartItems = localStorage.getItem("productsInCart");
        cartItems = JSON.parse(cartItems);
        let productContainer = document.querySelector(".products");
        let cartCost = localStorage.getItem("totalCost");

        if (cartItems && productContainer) {
            productContainer.innerHTML = "";
            Object.values(cartItems).map(item => {
                productContainer.innerHTML += `
                <div class="product">
                    <ion-icon class="remove-item" name="close-outline" data-tag="${item.tag}"></ion-icon>
                    <img src="./images/${item.tag}.jpg">
                    <span>${item.name}</span>
                    <div class="price">$${item.price},00</div>
                    <div class="quantity">
                        <ion-icon class="decrease" name="chevron-back-circle-outline" data-tag="${item.tag}"></ion-icon>
                        <span>${item.inCart}</span>
                        <ion-icon class="increase" name="chevron-forward-circle-outline" data-tag="${item.tag}"></ion-icon>
                    </div>
                    <div class="total">$${item.inCart * item.price},00</div>
                </div>
                `;
            });

            productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">
                    Basket Total
                </h4>
                <h4 class="basketTotal">
                    $${cartCost},00
                </h4>
            </div>
            `;
        } 

        attachEventListeners();
    }

    // 綁定事件監聽器
    function attachEventListeners() {
        let increaseButtons = document.querySelectorAll(".increase");
        let decreaseButtons = document.querySelectorAll(".decrease");
        let removeButtons = document.querySelectorAll(".remove-item");

        increaseButtons.forEach(button => {
            button.addEventListener("click", () => {
                let tag = button.dataset.tag;
                increaseQuantity(tag);
            });
        });

        decreaseButtons.forEach(button => {
            button.addEventListener("click", () => {
                let tag = button.dataset.tag;
                decreaseQuantity(tag);
            });
        });

        removeButtons.forEach(button => {
            button.addEventListener("click", () => {
                let tag = button.dataset.tag;
                removeItem(tag);
            });
        });
    }

    onloadCartNumbers();
    updateCartDisplay();
});

onloadCartNumbers();
displayCart();