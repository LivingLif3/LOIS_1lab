export class Parser {

    //Создание класса
    constructor(data) {
        this.data = data
        this.predicate = []
        this.parcel = []
    }

    //Построчно выделяем посылки и предикаты
    splitByLinesExpression() {
        this.data = this.data.split('\r\n')
        return this.data
    }

    //Удаляем пробелы
    deleteSpaces() {
        this.data = this.data.map((item) => {
            return item.replace(/ /g, '')
        })
    }

    //Находим выражения, деля на предикаты и посылки
    findExpressions() {
        let type = 'predicate'
        let quantity = 0
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] === '' && quantity === 0) {
                type = 'parcel'
                quantity++
                continue
            }
            switch (type) {
                case 'predicate':
                    this.predicate.push(this.data[i])
                    break
                case 'parcel':
                    this.parcel.push(this.data[i])
                    break
            }
        }
    }

    //Выделяем значащие выражения
    eraseWhetherExpression() {
        this.data = this.data.filter((item) => {
            if (item) return item
        })
        return this.data
    }

    //Проверяем на правильность составления множества
    checkRightValueSet() {
        let regExp = /([A-Z]\d*)=(\{(\([a-z]\d*,\d(\.\d+)?\))(,\([a-z]\d*,\d(\.\d+)?\))*})|\{}/
        let test = this.data.filter((item) => {
            return regExp.test(item)
        })
        return test
    }

    //Парсим предикаты, разделяя на имя множества и значения
    parsePredicates() {
        this.predicate = this.predicate.map((el) => {
            el = el.split('=')
            el[1] = el[1].replace(/[}{]/g, '').split('),')
            el[1][0] += ')'
            return {name: el[0], set: el[1]}
        })
        return this.predicate
    }

    //Парсим посылки на имя множества и значения
    parseParcels() {
        this.parcel = this.parcel.map((el) => {
            el = el.split('=')
            el[1] = el[1].replace(/[}{]/g, '').split('),')
            el[1][0] += ')'
            return {name: el[0], set: el[1]}
        })
        return this.parcel
    }

    //Парсит один кортеж на ключ и значение
    parseElement(element) {
        console.log(element)
        let newObject = {}
        newObject.cortege = element.set.map((el) => {
            el = el.split('')
            el.shift()
            el.pop()
            el = el.join('')
            return {name: el.split(',')[0], value: Number(el.split(',')[1])}
        })
        return newObject
    }

    //Функция преобразующая множество в новое множество
    changeParcelsAndPredicates() {
        this.predicate = this.predicate.map((item) => {
            return {name: item.name, corteges: this.parseElement(item)}
        })
        this.parcel = this.parcel.map((item) => {
            return {name: item.name, corteges: this.parseElement(item)}
        })
        console.log(this.predicate, this.predicate)
    }

    //Запускает работу парсера
    startParser(){
        this.splitByLinesExpression()
        this.deleteSpaces()
        this.findExpressions()
        this.eraseWhetherExpression()
        if (!this.checkRightValueSet()) {
            process.exit(0)
        }
        this.parsePredicates()
        this.parseParcels()
        this.changeParcelsAndPredicates()
    }
}