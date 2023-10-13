export class GenerateAllRules {
    constructor(setsSymbols) {
        this.setsSymbols = setsSymbols
        this.rules = []
    }

    get generate() {
        for(let i = 0; i < this.setsSymbols.length; i++) {
            for(let j = 0; j < this.setsSymbols.length; j++) {
                if(i !== j) {
                    this.rules.push([this.setsSymbols[i], this.setsSymbols[j]])
                }
            }
        }
        return this.rules
    }
}

// const generator = new GenerateAllRules(['A', 'B', 'C'])
//
// console.log(generator.generate)
