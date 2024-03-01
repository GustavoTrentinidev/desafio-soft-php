class SuiteStore {
    suiteLocalStorage = localStorage

    addCartProductSelected = {}
    
    async fetchDataGET(url){
        let storageUser = JSON.parse(this.suiteLocalStorage.getItem("user")) || []
        let requestData = fetch(url, {
            headers: {
                Authorization: storageUser.accessToken.token
            }
        }).then((response)=>{
            return response.json()
        })
        let data = await requestData
        return data
    }

    async fetchDataPOST(url, body){
        let storageUser = JSON.parse(this.suiteLocalStorage.getItem("user")) || []
        let res = fetch(url, {
            method: 'POST',
            body,
            headers: {
                Authorization: storageUser.accessToken.token
            }
        }).then(response =>{
            return response.json()
        })
        let returned = await res;
        return returned
    }

    async fetchDataDELETE(url){
        let response = await fetch(url, {method: 'DELETE',}).then(response=>{
            return response.json()   
        })
        let returnRes = await response
        return returnRes     
    }
    
    getCartFromStorage(){
        let cart = this.suiteLocalStorage.getItem("cart")
        if(cart){
            cart = JSON.parse(cart)
        }else {
            cart = []
        }
        return cart
    }

    async createCategory(e){
        e.preventDefault()
        const createCategoryNameInput = document.getElementById("category-name")
        const createCategoryTaxInput = document.getElementById("category-tax")
        let {value: category} = createCategoryNameInput
        let {value: tax} = createCategoryTaxInput

        const formData = new FormData()
        formData.append("name", category)
        formData.append("tax", tax)
    
        if(category && tax){
            try {
                await this.fetchDataPOST("http://localhost/routes/categories.php", formData)
                return this.readCategories()
            } catch (e){
                throw new Error(e)
            }
        }
        throw new Error("You have to pass all the arguments.")
    }

    async deleteCategory(id){
        const error = document.getElementById("purchase-error")
        error.style.display = "none"
        let deleteResponse = await this.fetchDataDELETE(`http://localhost/routes/categories.php?id=${id}`)
        if(!deleteResponse.error){
            this.readCategories() 
            return
        } 
        error.innerText = deleteResponse.error
        this.popUp(error)
        throw new Error(deleteResponse.error)
    }
    
    async readCategories(){
        let categories = await this.fetchDataGET("http://localhost/routes/categories.php")

        this.updateRows()
        
        const categoriesTable = document.getElementById("categories-table")
        
        for(let row of this.createTableRow(categories, {addBtn: "del", storageItem: "Category"})){
            categoriesTable.appendChild(row)
        }
    }

    updateRows(){
        const trs = document.querySelectorAll(".tritem")
        for(let tr of trs ){
            tr.remove()
        }
    }

    createTableRow(data, buttonOptions){
        const {addBtn, storageItem} = buttonOptions
        let rowsCreated = []
        for(let item of data){
            if(item.active){
                const tableRow = document.createElement("tr")
                for(let key of Object.keys(item)){
                    if(key != "active"){
                        if(key == "category" && typeof(item[key]) == "object"){
                            tableRow.appendChild(this.insertTableData(item[key].category)) 
                        }else{
                            tableRow.appendChild(this.insertTableData(item[key])) 
                        }
                    }
                }
                if(addBtn == "del"){
                   tableRow.appendChild(this.insertDeleteTableButton(item.id, storageItem)) 
                } else if(addBtn == "view"){
                    tableRow.appendChild(this.insertViewTableButton(item.id))
                }
                tableRow.setAttribute("class", "tritem")
                rowsCreated.push(tableRow)
            }
        }
        return rowsCreated
    }

    insertViewTableButton(id){
        const td = document.createElement("td")
        const viewBtn = document.createElement("button")
        viewBtn.setAttribute("onclick", `suiteStore.viewItem(${id})`)
        viewBtn.innerText = "View"
        td.appendChild(viewBtn)
        return td
    }

    insertDeleteTableButton(id, storageItem){
        const td = document.createElement("td")
        const deleteBtn = document.createElement("button")
        deleteBtn.setAttribute("onclick", `suiteStore.delete${storageItem}(${id})`)
        deleteBtn.setAttribute("value", id)
        deleteBtn.innerText = "Delete"
        td.appendChild(deleteBtn)
        return td
    }

    insertTableData(key){
        const td = document.createElement("td")
        td.innerText = key
        return td
    }


    async getCategoriesOnProductsPage(){
        const categories = await this.fetchDataGET("http://localhost/routes/categories.php")
        const selectElement = document.getElementById("select-category")
        const dataAndSelectElement = {data: categories, selectElement}
        this.fillSelectElementWithDataOptions(dataAndSelectElement, "name")
    }

    fillSelectElementWithDataOptions(dataAndSelectElement, textKey){
        let {data, selectElement} = dataAndSelectElement
        for(let item of data){
            if(item.active && item.amount != 0){
                const option = document.createElement("option")
                option.setAttribute("value", item.id)
                option.innerText = item[textKey]
                selectElement.appendChild(option)
            }

        }
    }

    async createProduct(e){
        e.preventDefault()
        const productNameInput = document.getElementById("product-create-name")
        const productAmountInput = document.getElementById("product-create-amount-available")
        const productCategorySelect = document.getElementById("select-category")
        const productPriceInput = document.getElementById("product-create-price")

        let {value: name} = productNameInput,
            {value: amount} = productAmountInput,
            {value: price} = productPriceInput,
            {value: category} = productCategorySelect
        
        let formData = new FormData()
        formData.append("name", name)
        formData.append("price", price)
        formData.append("category_id", category)
        formData.append("amount", amount)

        if(name && amount && price && category){
            await this.fetchDataPOST("http://localhost/routes/products.php", formData)
            this.readProducts()
        }
        throw new Error("You have to pass all the arguments.")
    }

    async readProducts(){
        const productTable = document.getElementById("product-table")
        const products = await this.fetchDataGET("http://localhost/routes/products.php")

        this.updateRows()

        for(let row of this.createTableRow(products, {addBtn: "del", storageItem: "Product"}, true)){
            productTable.appendChild(row)
        }
    }

    async deleteProduct(id){
        await this.fetchDataDELETE(`http://localhost/routes/products.php?id=${id}`)
        this.readProducts() 
    }

    async getProductsOnHomePage(){
        const products = await this.fetchDataGET("http://localhost/routes/products.php")
        const amountInput = document.getElementById("add-to-cart-amount")
        amountInput.value = 0
        const selectElement = document.getElementById("home-product-select")
        while(selectElement.childNodes.length > 2){
            selectElement.removeChild(selectElement.lastChild)
        }
        this.fillSelectElementWithDataOptions({data: products, selectElement}, "name")
    }

    async changeTaxAndPriceInputValuesOnSelectChange(e){
        this.addCartProductSelected = {}
        const {value: productId} = e.target
        const product = await this.fetchDataGET(`http://localhost/routes/products.php?=${productId}`)
        const priceInput = document.getElementById("add-to-cart-price")
        const taxInput = document.getElementById("add-to-cart-tax")
        const amountInput = document.getElementById("add-to-cart-amount")
        const amountAvailable = document.getElementById("amount-available")

        this.addCartProductSelected = product

        amountInput.disabled = false
        amountInput.value = ""
        amountInput.max= product.amount
        taxInput.value = product.tax + "%"
        priceInput.value = "R$" + product.price
        amountAvailable.innerText = product.amount
    }

    async calcPrice(e){
        const { value: amount } = e.target
        let priceInput = document.getElementById("add-to-cart-price")
        let newPrice = parseFloat(amount) * parseFloat(this.addCartProductSelected.price)
        priceInput.value = "R$" + newPrice.toFixed(2)
    }

    addDecimalsPriceString(priceString){
        let decimais = priceString.split(".")[1]
        if(decimais){
            if(decimais.length == 1){
                priceString += "0"
            }
        }else{
            priceString+= ".00"
        }
        return priceString
    }

    addProductToCart(e){
        e.preventDefault()
        let cart = this.getCartFromStorage()
        const priceInput = document.getElementById("add-to-cart-price")
        const taxInput = document.getElementById("add-to-cart-tax")
        const amountInput = document.getElementById("add-to-cart-amount")
        const productSelect = document.getElementById("home-product-select")

        let {value: product} = productSelect,
            {value: amount} = amountInput,
            {value: tax} = taxInput,
            {value: price} = priceInput

        product = this.addCartProductSelected

        let id = 1

        if(cart.length){
            id += cart.length
        }
        
        let productAlreatyInCart = this.verifyIfProductAlreadyInCart(product.id)
        
        if(productAlreatyInCart){
            console.log(productAlreatyInCart)
            this.updateCart(productAlreatyInCart, {amount, price})
            return
        }

        cart.push({product, amount, tax, price, active: true, id})
        let stringifyiedCart = JSON.stringify(cart)
        this.suiteLocalStorage.setItem("cart", stringifyiedCart)
        
        this.readCart()
    }

    updateCart(productInCart, changes){
        let cart = this.getCartFromStorage()
        const {amount, price} = changes
        
        let newAmount = parseInt(productInCart.amount) + parseInt(amount)

        let newPrice = parseFloat(productInCart.price.split("$")[1]) + parseFloat(price.split("$")[1]) 
        newPrice = "R$" + newPrice
        newPrice = this.addDecimalsPriceString(newPrice)
        
        cart = cart.map(item=>{
            if(item.id == productInCart.id){
                if(productInCart.active){
                    item.price = newPrice
                    item.amount = newAmount
                    return item
                }
                item.active = true
                item.price = price
                item.amount = amount
                return item
            }
            return item
        })
        let stringifyiedCart = JSON.stringify(cart)
        this.suiteLocalStorage.setItem("cart", stringifyiedCart)

        this.readCart()
    }

    verifyIfProductAlreadyInCart(productId){
        const cart = this.getCartFromStorage()
        for(let item of cart){
            if(item.product.id == productId){
                return item
            }
        }
    }

    calcTaxes(){
        const cart = this.getCartFromStorage()
        const taxInput = document.getElementById("cart-taxes")
        let taxes = 0

        for(let product of cart){
            if(product.active){
                let productTax = parseFloat(product.product.tax) / 100
                let productAmount = parseFloat(product.amount)
                let unitPrice = parseFloat(product.product.price) 
                let appliedTax = (unitPrice * productTax) * productAmount 
                taxes += appliedTax
            }
        }
        let intTax = taxes.toFixed(2) 
        
        let stringTax = "R$" + intTax
        stringTax = this.addDecimalsPriceString(stringTax)
        taxInput.value = stringTax
        return {intTax, stringTax}
    }

    calcTotal(taxes){
        const data = this.getCartFromStorage()
        const totalInput = document.getElementById("cart-total")
        let {intTax} = taxes
        let total = parseFloat(intTax)
        for(let item of data){
            if(item.active){
                let intPrice = parseFloat(item.price.split("$")[1])
                total += intPrice
            }
        }
        total = total.toFixed(2)
        let stringTotal = "R$" + total
        stringTotal = this.addDecimalsPriceString(stringTotal)
        totalInput.value = stringTotal
        return total
    }

    cancelCart(){
        this.suiteLocalStorage.setItem("cart", [])
        const trs = document.querySelectorAll("tr")
        for(let i = 1; i < trs.length; i++){
            trs[i].remove()
        }
        const taxes = this.calcTaxes()
        this.calcTotal(taxes)
    }

    readCart(){
        let cart = this.getCartFromStorage()

        
        let filterCartItemInfo = cart.map((item)=>{
            let {id, product, amount, price, active} = item   
            return {id, product: product.name, unit_price: "R$" + product.price, amount, price, active}
        })
        
        this.updateRows(cart)
        
        const cartTable = document.getElementById("cart-table")
        for(let row of this.createTableRow(filterCartItemInfo, {addBtn: "del", storageItem: "CartItem"})){
            cartTable.appendChild(row)
        }

        const taxes = this.calcTaxes()
        this.calcTotal(taxes)

    }

    deleteCartItem(id){
        let cart = this.getCartFromStorage()
        for(let item of cart){
            if (item.id == id){
                item.active = false
            }
        }
        this.suiteLocalStorage.setItem("cart", JSON.stringify(cart))
        this.readCart()
    }

    async finishCart(){
        const cart = this.getCartFromStorage()
        if(cart.length){
            let buyedItems = cart.filter(item=>{
                if(item.active){
                    return item
                }
            }) 
            await this.addBuyToHistory(buyedItems)
        }
    }

    popUp(element){
        element.style.display = "block"
        setTimeout(()=>{
            element.style.display = "none"
        },4900)
    }

    async addBuyToHistory(products){
        let orderProductsArray = products.map(product=>{
            return {id: product.product.id, amount: parseInt(product.amount)}
        })
        await this.createOrder(orderProductsArray)
    }

    async createOrder(products){
        const error = document.getElementById("purchase-error")

        let orderCreateRes = await this.fetchDataPOST("http://localhost/routes/orders.php", JSON.stringify(products))
        if(orderCreateRes.error){
            error.innerText = orderCreateRes.error
            this.popUp(error)
            return
        }
        const alert = document.getElementById("purchase-completed")
        this.popUp(alert)
        this.cancelCart()
        this.getProductsOnHomePage()
        return 
        
    }

    async readHistory(){
        const purchases = await this.fetchDataGET("http://localhost/routes/orders.php")
        const historyTable = document.getElementById("purchase-history-table")
        
        let purchasesMap = purchases.map(item=>{
            const {id, total, tax, active} = item
            return {id, tax: "R$" + tax, total: "R$" + total, active}
        })

        for(let row of this.createTableRow(purchasesMap, {addBtn: "view", storageItem: "History"})){
            historyTable.appendChild(row)
            
        }
    }

    async viewItem(id){
        const viewArea = document.getElementById("view-purchase")
        const noItemSelectText = document.getElementById("noitemselectd")
        viewArea.classList.add("show")
        noItemSelectText.style.display = "none"
        const accessedPurchase = await this.fetchDataGET(`http://localhost/routes/orders.php?id=${id}`)
        this.displayPurchaseInfo(accessedPurchase)
    }

    closeViewItem(){
        const viewArea = document.getElementById("view-purchase")
        const noItemSelectText = document.getElementById("noitemselectd")
        viewArea.classList.remove("show")
        noItemSelectText.style.display = "block"
    }

    displayPurchaseInfo(purchase){
        console.log(purchase)
        const purchaseNumber = document.getElementById("purchase-code")
        const purchaseTable = document.getElementById("purchase-table")
        const purchaseTaxInput = document.getElementById("purchase-tax")
        const purchaseTotalInput = document.getElementById("purchase-total")

        while(purchaseTable.childNodes.length > 2){
            purchaseTable.removeChild(purchaseTable.lastChild)
        }

        let {products: purchaseProducts} = purchase
        
        purchaseProducts = purchaseProducts.map(item=>{
            console.log(item)
            const {name, amount, price, total} = item
            return {name, price: "R$" + price, amount, total: "R$" + total, active: true}
        })

        purchaseTaxInput.value = "R$" + purchase.order_info.order_tax
        purchaseTotalInput.value = "R$" + purchase.order_info.order_total
        purchaseNumber.innerText = "Purchase " + purchase.order_info.order_id

        for(let row of this.createTableRow(purchaseProducts, {addBtn: "", storageItem: ""})){
            purchaseTable.appendChild(row)
        }

    }

    async login(data){
        const error = document.getElementById("error-login")
        error.style.display = 'none'
        let loginReq = fetch("http://localhost/routes/auth/login.php", {
            method: 'POST',
            body: data,
        }).then(res=>res.json())
        let loginInfo = await loginReq
        if(loginInfo.error){
            error.innerText = loginInfo.error
            error.style.display = 'block'
            return
        }
        this.suiteLocalStorage.setItem("user", JSON.stringify(loginInfo))
        window.location.pathname = '/front-antigo/pages/home.html'
    }

    setLoginInfo(e){
        e.preventDefault()
        const username = document.getElementById("login-username").value
        const password = document.getElementById("login-password").value
        
        let formData = new FormData()
        formData.append("username", username)
        formData.append("password", password)

        this.login(formData)
        
    }

    async setRegisterInfo(e){
        e.preventDefault()
        const error = document.getElementById("error-register")
        const username = document.getElementById("register-username").value
        const password = document.getElementById("register-password").value
    
        let formData = new FormData()
        formData.append("username", username)
        formData.append("password", password)
        
        let registerReq = fetch("http://localhost/routes/auth/register.php", {
            method: 'POST',
            body: formData
        }).then(res=>res.json())

        
        let registerInfo = await registerReq 
        if(registerInfo.error){
            error.innerText = registerInfo.error
            error.style.display = 'block'
        }

        if(registerInfo.error){
            console.log(registerInfo.error)
            return
        }
        this.login(formData)
    }

    async logout(){
        let storageUser = JSON.parse(this.suiteLocalStorage.getItem("user")) || []
        if(storageUser.accessToken){
            let logoutRes = await fetch("http://localhost/routes/auth/logout.php?id=2", {
                headers: {
                    Authorization: storageUser.accessToken.token
                }
            })
        }
        this.suiteLocalStorage.setItem("user", JSON.stringify({}))
    }

    requireAuth(){
        let storageUser = JSON.parse(this.suiteLocalStorage.getItem("user")) || []
        if(!storageUser.accessToken){
            window.location.pathname = '/front-antigo/pages/auth.html'
        }else {
            let loginListItem = document.getElementById("login") 
            loginListItem.innerText = "Logout"
        }
    }

    loadPage(){
        let pathNameSplit = window.location.pathname.split("/")
        let pageName = pathNameSplit[pathNameSplit.length - 1].split(".")[0]

        if(pageName == "categories"){
            return this.readCategories(), this.requireAuth()
        }

        if(pageName == "products"){
            return this.getCategoriesOnProductsPage(), this.readProducts(), this.requireAuth()
        }

        if(pageName == "home"){
            return this.getProductsOnHomePage(), this.readCart(), this.requireAuth()
        }
        
        if(pageName == "history"){
            return this.readHistory(), this.requireAuth()
        }
        
        if(pageName == "auth"){
            return this.logout()
        }
    }

}

const suiteStore = new SuiteStore()

suiteStore.loadPage()