import { array } from "zod";

export interface IRecordPathInput {
    recordPath: RecordPath;
    value: any;
}

export class RecordPath {
    public readonly path: string[];

    constructor(path: string[]) {
        this.path = path;
    }

    public addSegment(segment: string): RecordPath {
        this.path.push(segment);
        return this;
    }

    /**
     * 最初のパスセグメントを削除し、新しいRecordPathを返します
     * @returns 最初のセグメントを除いた新しいRecordPath
     */
    public shift(): RecordPath {
        if (this.path.length === 0) {
            throw new Error("Path is empty");
        }
        return new RecordPath(this.path.slice(1));
    }

    /**
     * パスを文字列に変換します。
     * @param delimiter: 区切り文字。例えば "." や"/"など。
     * @returns 
     */
    public static fromString(path: string, delimiter: string = "/"): RecordPath {
        return new RecordPath(path.split(delimiter));
    }

    /**
     * レコードの指定されたパスに値を設定します。もしパスが存在しない場合はエラーになります。
     * @param record 
     * @param path 
     * @param value 
     * @returns 
     */
    public static modifyRecordByPath(record: { [key: string]: any }, input:IRecordPathInput): { [key: string]: any } | null {
        const path = input.recordPath;
        const value = input.value;
        let currentRecord = record;
        let currentPath = path.path;

        try {
            for (let i = 0; i < currentPath.length - 1; i++) {
                if (currentRecord[currentPath[i]] === undefined) {
                    throw new Error(`Path segment '${currentPath[i]}' does not exist in the record.`);
                }
                currentRecord = currentRecord[currentPath[i]];
            }

            if (currentRecord[currentPath[currentPath.length - 1]] === undefined) {
                throw new Error(`Final path segment '${currentPath[currentPath.length - 1]}' does not exist in the record.`);
            }

            currentRecord[currentPath[currentPath.length - 1]] = value;
        } catch (error) {
            console.error("Error modifying record by path:", error);
            return null; // エラーが発生した場合は null を返す
        }

        return record;
    }

    /**
     * レコードの指定されたパスに値を追加します。もしパスが存在しない場合は新しいオブジェクトを作成します。
     * @param record 
     * @param path 
     * @param value 
     * @returns 
     */
    public static addRecordByPath(record: { [key: string]: any }, input:IRecordPathInput): { [key: string]: any } | null {
        const path = input.recordPath;
        const value = input.value;
        let currentRecord = record;
        let currentPath = path.path;

        try {
            for (let i = 0; i < currentPath.length - 1; i++) {
                if (currentRecord[currentPath[i]] === undefined) {
                    currentRecord[currentPath[i]] = {}; // パスが存在しない場合は新しいオブジェクトを作成
                }
                currentRecord = currentRecord[currentPath[i]];
            }

            currentRecord[currentPath[currentPath.length - 1]] = value;
        } catch (error) {
            console.error("Error adding record by path:", error);
            return null; // エラーが発生した場合は null を返す
        }

        return record;
    }

    /**
     * レコードの指定されたパスからデータを取得します。
     * @param record 
     * @param path 
     * @returns 
     */
    public static getDataByPath(record: { [key: string]: any }, path: RecordPath): any {
        let currentRecord = record;
        let currentPath = path.path;

        try {
            for (let i = 0; i < currentPath.length; i++) {
                if (currentRecord[currentPath[i]] === undefined) {
                    throw new Error(`Path segment '${currentPath[i]}' does not exist in the record.`);
                }
                currentRecord = currentRecord[currentPath[i]];
            }
        } catch (error) {
            console.error("Error getting data by path:", error);
            return null; // エラーが発生した場合は null を返す
        }

        return currentRecord;
    }

    /**
     * 型の整合性を保証しながらレコードの指定されたパスに値を設定します。
     * @param record 
     * @param path 
     * @param value 
     * @returns 
     */
    public static modifyRecordByPathWithTypes<T>(record: T, input:IRecordPathInput): T | null {
        const path = input.recordPath;
        console.log("path : ", path);
        const value = input.value;
        let currentRecord: any = record;
        let currentPath = path.path;
    
        try {
            if (currentPath.length === 0) {
                return record;
            }

            for (let i = 0; i < currentPath.length - 1; i++) {
                //currentRecordが配列かobjectかで分岐
                console.log("currentRecord : ", currentRecord);
                if (Array.isArray(currentRecord)) {
                    const index = parseInt(currentPath[i]);

                    if (index > currentRecord.length) {
                        // 配列の長さを超える場合は空白で埋める
                        for (let j = currentRecord.length; j <= index; j++) {
                            let 一個前の要素 = currentRecord[j - 1];
                            currentRecord.push(一個前の要素); // ここでj番目の要素が追加される
                        }
                    }


                    if (currentRecord[index] === undefined) {
                        throw new Error(`Path segment '${currentPath[i]}' does not exist in the record.`);
                    }
                    currentRecord = currentRecord[index];
                } else {
                    console.log("key : ", currentPath[i]);
                    if (currentRecord[currentPath[i]] === undefined) {
                        throw new Error(`Path segment '${currentPath[i]}' does not exist in the record.`);
                    }
                    currentRecord = currentRecord[currentPath[i]];
                }
            }
    
            const finalSegment = currentPath[currentPath.length - 1];
            console.log("finalRecord : ", currentRecord[finalSegment]);
            //currentRecordが配列かobjectかで分岐
            if (Array.isArray(currentRecord)) {
                const index = parseInt(finalSegment);

                if (index >= currentRecord.length) {
                    // 配列の長さを超える場合は空白で埋める
                    for (let j = currentRecord.length; j <= index; j++) {
                        let 一個前の要素 = currentRecord[j - 1];
                        currentRecord.push(一個前の要素); // ここでj番目の要素が追加される
                    }
                }
            } 

            if (currentRecord[finalSegment] === undefined) {
                console.error("finalSegment : ", finalSegment, currentRecord);
                throw new Error(`Final path segment '${finalSegment}' does not exist in the record.`);
            }
    
            // 前の値の型と value の型を比較
            if (typeof currentRecord[finalSegment] !== typeof value) {
                console.error("currentRecord[finalSegment] : ", currentRecord[finalSegment]);
                throw new Error(`Type mismatch: expected type '${typeof currentRecord[finalSegment]}', but got type '${typeof value}'.`);
            }
    
            currentRecord[finalSegment] = value;
        } catch (error) {
            console.error("Error modifying record by path:",currentPath, currentRecord, value ,error);
            return null; // エラーが発生した場合は null を返す
        }
    
        return record;
    }

    public static deleteRecordByPathWithTypes<T extends object>(record: T, recordPath:RecordPath) {
        //recordPathの最後のセグメントは配列の要素になっているはずなので、まず１個手前の配列を取得する
        const arrayPath = recordPath.path.slice(0, recordPath.path.length - 1); //抽出する範囲の終わりのインデックスを指定しますが、このインデックスは抽出される範囲に含まれません。なのでlength-2までの強さではある。
        const finalSegment = recordPath.path[recordPath.path.length - 1];
        let lastArray = RecordPath.getDataByPath(record, new RecordPath(arrayPath));
        if (lastArray === null) {
            return null;
        }

        if (!Array.isArray(lastArray)) {
            console.error("lastArray : ", lastArray);
            throw new Error("Final segment must be an array.");
        }

        const index = parseInt(finalSegment);
        if (index >= lastArray.length) {
            // throw new Error("Index out of range.");
            //要素を追加した後、保存しないで削除を押すと、データに保存されてないインデックスの要素を削除することもクライアントの動作としてあり得る
            //なのでこの場合は何もしないで終わる
            return
        }

        lastArray.splice(index, 1);



    }
}

// テスト関数
export function testAddRecordByPath() {
    // 使用例
    const record = {
        user: {
            name: "Alice",
            address: {
                city: "Wonderland"
            }
        }
    };

    const path = new RecordPath(["user", "address", "city", "money"]);
    const updatedRecord = RecordPath.addRecordByPath(record, {recordPath:path, value:"New Wonderland"});

    console.log(updatedRecord);
}

export function testModifyRecordByPath() {
    // 使用例
    const record = {
        user: {
            name: "Alice",
            address: {
                city: "Wonderland"
            }
        }
    };

    const path = new RecordPath(["user", "address", "city"]);
    const updatedRecord = RecordPath.modifyRecordByPath(record, {recordPath:path, value:"New Wonderland"});

    console.log(updatedRecord);
}

export function testModifyRecordByPathWithTypes() {
    // 使用例
    const record = {
        user: {
            name: "Alice",
            address: {
                city: "Wonderland",
                towns: ["town1", "town2"]
            }
        }
    };

    const path = new RecordPath(["user", "address", "towns", "1"]);
    const updatedRecord = RecordPath.modifyRecordByPathWithTypes(record, {recordPath:path, value:"New Wonderland"});

    console.log(updatedRecord);
}

export function testGetDataByPath() {
    // 使用例
    const record = {
        user: {
            name: "Alice",
            address: {
                city: "Wonderland"
            }
        }
    };

    const path = new RecordPath(["user", "address"]);
    const data = RecordPath.getDataByPath(record, path);

    console.log(data);
}

// // テスト関数の呼び出し
// testAddRecordByPath();
// testModifyRecordByPath();
// testModifyRecordByPathWithTypes();
// testGetDataByPath();

testModifyRecordByPathWithTypes();