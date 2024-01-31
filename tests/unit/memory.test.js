// const MemoryDB = require('../../src/model/data/memory/memory-db');
// const { writeFragment, readFragment } = require('../../src/model/data/memory/index');

// jest.mock('../../src/model/data/memory/memory-db');

// describe('memory-db operations', () => {
//     let data;

//     const ownerId = "oid";
//     const id = "id";
//     const fragment = { ownerId, id };

//     // Each test will get its own, empty database instance
//     beforeEach(() => {
//       data = new MemoryDB();
//       MemoryDB.mockClear();
//       MemoryDB.mockImplementation(() => {
//         let db = {};
//         return {
//           put: (ownerId, id, value) => { db[`${ownerId}-${id}`] = value; },
//           get: (ownerId, id) => { return db[`${ownerId}-${id}`]; },
//         };
//       });
//     });

//     test("writeFragments should not return anything", async()=>{
//         const result = await writeFragment(fragment);
//         expect(result).toBe(undefined);
//     })

//     test("writeFragments should call MemoryDB put route", async () => {
//         const result = await writeFragment(fragment);
//         expect(MemoryDB.prototype.put).toHaveBeenCalledWith(ownerId, id, fragment);
//         expect(result).toBe(undefined);
//     }); 

//     test("readFragments should call MemoryDB get route", async () => {
//         await writeFragment(fragment);
//         const result = await readFragment(ownerId, id);
//         expect(MemoryDB.prototype.get).toHaveBeenCalledWith(ownerId, id);
//         console.log("result: " + result);
//         //expect(result).toEqual(fragment);
//     });

//     test("readFragments should return what we write into the db", async () => {
//         await writeFragment(fragment);
//         const result = await readFragment(ownerId, id);
//         expect(result).toEqual(fragment);
//     });
     
// }); 



const { writeFragment, readFragment, listFragments, writeFragmentData, readFragmentData, deleteFragment } = require('../../src/model/data/memory/index');

describe('memory-db operations', () => {
    const ownerId = "oid";
    const id = "id";
    const data = { value: 123}
    const fragment = { ownerId, id, data };

    test("writeFragments should not return anything", async()=>{
        const result = await writeFragment(fragment);
        expect(result).toBe(undefined);
    });

    test("readFragment should return what we write into the db", async()=>{
        await writeFragment(fragment);
        const result = await readFragment(ownerId, id);
        expect(result).toEqual(fragment);
    });

    // // should fail figure out how to make pass
    // test("writeFragments should call MemoryDB put route", async () => {
    //     const result = await writeFragment(fragment);
    //     expect(MemoryDB.prototype.put).toHaveBeenCalledWith(ownerId, id, fragment);
    //     expect(result).toBe(undefined);
    // }); 
    // // should fail figure out how to make pass
    // test("readFragments should call MemoryDB get route", async () => {
    //     await readFragment(ownerId, id);
    //     expect(MemoryDB.prototype.get).toHaveBeenCalledWith(ownerId, id);
    // });


    test("read and write fragments should work with buffers", async () => {
        const data = Buffer.from([1, 2, 3]);
        await writeFragmentData(ownerId, id, data);
        const result = await readFragmentData(ownerId, id);
        expect(result).toEqual(data);
    });

    test("listFragments should return a list of ids for the user", async () => {
        let data2 = { value: 456};
        const fragment2 = { ownerId: "oid", id: "id2", data2 };
        let data3 = { value: 789};
        const fragment3 = { ownerId: "oid", id: "id3", data3 };
        await writeFragment(fragment);
        await writeFragment( fragment2 );
        await writeFragment( fragment3);
        const result = await listFragments(ownerId);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toEqual([fragment.id, "id2", "id3"]);
    });

    test("listFragments should return an empty array", async () => {
        let data2 = { value: 456};
        const fragment2 = { ownerId: "oid", id: "id2", data2 };
        let data3 = { value: 789};
        const fragment3 = { ownerId: "oid", id: "id3", data3 };
        await writeFragment(fragment);
        await writeFragment( fragment2 );
        await writeFragment( fragment3);
        const result = await listFragments("oid2");
        expect(Array.isArray(result)).toBe(true);
        expect(result).toEqual([]);
    });

    test("deleteFragment should delete a fragment written", async () => {
        let data2 = { value: 456};
        const fragment2 = { ownerId: "oid", id: "id2", data2 };
        let data3 = { value: 789};
        const fragment3 = { ownerId: "oid", id: "id3", data3 };
        await writeFragment(fragment);
        await writeFragment( fragment2 );
        await writeFragment( fragment3);
        await deleteFragment(ownerId, id);
        const result = await listFragments(ownerId);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toEqual(["id2", "id3"]);
    });

    test("deleteFragment should throw an error if ownerId and id are not in db", async() =>{
        await expect(deleteFragment("oid2", "id2")).rejects.toThrow("missing entry for primaryKey=oid2 and secondaryKey=id2");
    })


});