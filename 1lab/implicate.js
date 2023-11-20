export class ImplicationCopy {
    constructor(
        firstSet,
        secondSet,
        parcel,
    ) {
        this.firstSet = firstSet
        this.secondSet = secondSet
        this.parcel = parcel
        this.conjunctedMatrix = null
        this.implicateMatrix = null
    }

    get calculateImplication() {
        let result = []
        for(let i = 0; i < this.firstSet.corteges.length; i++) {
            let row = []
            let elements = []
            let value = 0
            for(let j = 0; j < this.secondSet.corteges.length; j++) {
                elements = [this.firstSet.corteges[i].name, this.secondSet.corteges[j].name]
                value = this.implicate(this.firstSet.corteges[i], this.secondSet.corteges[j])
                row.push([elements, value])
            }
            result.push(row)
        }
        this.implicateMatrix = result
        return result
    }

    implicate(firstEl, secondEl) {
        let value = firstEl.value <= secondEl.value ? 1 : secondEl.value
        return value
    }

    getElementsExceptOne(el, elements) {
        return elements.filter(element => element !== el)
    }

    checkRowConsistElement(row, el) { // Проверка, что ряд в импликативной матрице содержит нужный элемент в посылке
        let rowLength = row.length
        let counter = 0
        for(let i = 0; i < row.length; i++) {
            if(row[i][0][0] === el) {
                counter++
            }
        }
        return counter === rowLength
    }

    findRowWithNeededEl(implicationMatrix, el) { // Ищем строку с нужным элементом в импликативной матрице
        for(let i = 0; i < implicationMatrix.length; i++) {
            for(let j = 0; j < implicationMatrix[i].length; j++) {
                if(implicationMatrix[i][j][0][0] === el[0]) {
                    return i
                }
            }
        }
    }

    checkParcelAndResult(result) {
        let conjunctedMatrix = []
        if(result.length !== this.parcel.corteges.length) {
            return;
        }
        for(let i = 0; i < this.parcel.corteges.length; i++) {
            let count = 0
            for(let j = 0; j < result.length; j++) {
                if(this.checkRowConsistElement(result[j], this.parcel.corteges[i][0])) {
                    count++
                }
            }
            if(!count) {
                return
            }
        }

        for(let i = 0; i < this.parcel.corteges.length; i++) {
            let indexOfRow = this.findRowWithNeededEl(result, this.parcel.corteges[i])
            let row = []
            for(let j = 0; j < result[indexOfRow].length; j++) {
                let el = [...this.getElementsExceptOne(this.parcel.corteges[i][0], result[indexOfRow][j][0]), Math.min(this.parcel.corteges[i][1], result[indexOfRow][j][1])]
                row.push(el)
            }
            conjunctedMatrix.push(row)
        }
        return conjunctedMatrix
        // for(let i = 0; i < result.length; i++) {
        //     let row = []
        //     for(let j = 0; j < result[i].length; j++) {
        //         let el = [this.getElementsExceptOne(this.parcel.corteges[i].name, result[i][j][0]), Math.min(this.parcel.corteges[i].value, result[i][j][1])]
        //         row.push(el)
        //     }
        //     conjunctedMatrix.push(row)
        // }
        // for(let i = 0; i < conjunctedMatrix.length; i++) {
        //     if(conjunctedMatrix[i].length === 0) {
        //         return
        //     }
        // }
    }

    getConclusion(conjuctedMatrix) {
        let conclusion = []
        for(let i = 0; i < conjuctedMatrix[0].length; i++) {
            let column = []
            for(let j = 0; j < conjuctedMatrix.length; j++) {
                column.push(conjuctedMatrix[j][i])
            }
            column.sort((a, b) => b[1] - a[1])
            conclusion.push(column[0])
        }
        return conclusion
    }

    showAns(ans) {
        let string = "{"
        for(let i = 0; i < ans.length; i++) {
            let cortege = ""
            if(ans[i][0].length !== 1) {
                cortege = `((${ans[i][0].join(',')}),${ans[i][1]})`
            } else {
                cortege = `(${ans[i][0].join(',')},${ans[i][1]})`
            }
            string += cortege
            if(i !== ans.length - 1) {
                string += ','
            }
        }
        string += "}"
        return string
    }

    get getConjunctedMatrix() {
        return this.conjunctedMatrix
    }

    get getImplicationMatrix() {
        return this.implicateMatrix
    }

    calculate() {
        let conjuctedMatrix = this.checkParcelAndResult(this.calculateImplication)
        if(!conjuctedMatrix) {
            return console.log("")
        }
        this.conjunctedMatrix = conjuctedMatrix
        let ans = this.getConclusion(conjuctedMatrix)
        return ans
    }
}
