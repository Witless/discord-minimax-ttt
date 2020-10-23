export class Board {

    private array:number[][]= [[0,0,0],[0,0,0],[0,0,0]]
    private name: string = "";
    private readonly player: number;
    static playerA: number = 1; //Player A === machine
    static playerB: number = 2; //Player B === player (?

    constructor(name: string, value:number, player:number) {
        this.name = name;
        this.player = player;
        for(let i:number = 0; i<this.array.length; i++ ){
            for(let j:number = 0; j<this.array.length; j++){
                this.array[i][j] = value;
            }
        }
    }


    set(i:number, j:number, value:number): void {
        this.array[i][j] = value;
    }
    get(i:number, j:number): number{
        return this.array[i][j];
    }
    getArray(): number[][] {
        return this.array;
    }
    setArray(array:number[][]): void {
        this.array = array;
    }
    getPlayer(): number {
        return this.player;
    }

}

