export class Parser {

    //Создание класса
    constructor(data) {
        this.data = data
        this.predicate = []
        this.rules = []
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
                type = 'rule'
                quantity++
                continue
            }
            switch (type) {
                case 'predicate':
                    this.predicate.push(this.data[i])
                    break
                case 'rule':
                    this.rules.push(this.data[i])
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
        let regExp = /^([A-Z]\d*)=(\{(\([a-z]\d*,\d(\.\d+)?\))(,\([a-z]\d*,\d(\.\d+)?\))*})|\{}$/
        let test = this.predicate.filter((item) => {
            return regExp.test(item)
        })
        return test.length === this.predicate.length
    }

    //Проверяет на правильность составления правил
    checkRightValuesRules(){
        let regExp = /[A-Z]~>[A-Z]/
        let test = this.rules.filter((item) => {
            return regExp.test(item)
        })
        return test.length === this.rules.length
    }

    //Парсим предикаты, разделяя на имя множества и значения
    parsePredicates() {
        this.predicate = this.predicate.map((el) => {
            el = el.split('=')
            el[1] = el[1].replace(/[}{]/g, '').split('),')
            for (let i = 0; i < el[1].length - 1; i++) {
                el[1][i] += ')'
            }
            return {name: el[0], set: el[1]}
        })
        return this.predicate
    }

    //Парсит один кортеж на ключ и значение
    parseElement(element) {
        console.log(element)
        return element.set.map((el) => {
            el = el.split('')
            el.shift()
            el.pop()
            el = el.join('')
            return {name: el.split(',')[0], value: Number(el.split(',')[1])}
        })
    }

    parseRules() {
        this.rules = this.rules.map((el) => {
            el = el.split('~>')
            return [el[0], el[1]]
        })
    }

    //Функция преобразующая множество в новое множество
    changePredicates() {
        this.predicate = this.predicate.map((item) => {
            return {name: item.name, corteges: this.parseElement(item)}
        })
        console.log(this.predicate)
    }

    //Проверяет вывод на пустые множества
    checkEmptySet(){
        this.predicate = this.predicate.filter((item) => {
            if (item.corteges[0].name) return item
        })
    }

    //Проверяет на существование предикатов в правилах
    checkRules(){
        let rulesLength = this.rules.length
        let predicateNames = this.predicate.map((item) => {
            return item.name
        })
        this.rules = this.rules.filter((item) => {
            return (predicateNames.includes(item[0]) && predicateNames.includes(item[1]))
        })
        return rulesLength === this.rules.length
    }


    //Запускает работу парсера
    startParser(){
        this.splitByLinesExpression()
        this.deleteSpaces()
        this.findExpressions()
        this.eraseWhetherExpression()
        if (!(this.checkRightValueSet() && this.checkRightValuesRules())) {
            process.exit(0)
        }
        this.parsePredicates()
        this.parseRules()
        this.changePredicates()
        if(!this.checkRules()) {
            process.exit(0)
        }
    }
}