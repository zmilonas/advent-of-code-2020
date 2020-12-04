#!/usr/bin/env deno run --allow-read
import {assert} from "https://deno.land/std@0.79.0/testing/asserts.ts";

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'] as const;
const optionalFields = ['cid'] as const;

type PassportField = typeof requiredFields[number];
type Passport = Array<[PassportField, string]>;

function passportHasFields(pass: Passport): boolean {
    return requiredFields.filter(x => !pass.map(p => p[0]).includes(x)).length === 0;
}

function parsePassportFields(pass: string): Passport {
    return pass.replace(/\n/g, " ").split(" ").map((data) => data.split(":") as [PassportField, string])
}

function parsePassports(fileContent: string): Passport[] {
    return fileContent.split('\n\n').map(parsePassportFields);
}

/*
byr (Birth Year) - four digits; at least 1920 and at most 2002.
iyr (Issue Year) - four digits; at least 2010 and at most 2020.
eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
hgt (Height) - a number followed by either cm or in:
If cm, the number must be at least 150 and at most 193.
If in, the number must be at least 59 and at most 76.
hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
pid (Passport ID) - a nine-digit number, including leading zeroes.
cid (Country ID) - ignored, missing or not.
 */
const fieldValidator: Record<PassportField, (field: string) => boolean> = {
    ecl(field) {
        return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(field);
    }, eyr(field) {
        return field.length === 4 && parseInt(field) >= 2020 && parseInt(field) <= 2030;
    }, hcl(field) {
        return /^#[0-9a-f]{6}$/.test(field);
    }, hgt(field) {
        const heightRegexp = /^(?<val>\d{2,3})(?<unit>cm|in)$/;
        const matches = field.match(heightRegexp);
        if (!matches || !matches.groups) {
            return false;
        }
        const val = parseInt(matches.groups.val, 10);
        if (matches.groups.unit === "cm") {
            return val >= 150 && val <= 193;
        } else if (matches.groups.unit === "in") {
            return val >= 59 && val <= 76;
        }
        return false;
    }, iyr(field) {
        const number = parseInt(field, 10);
        if (isNaN(number)) {
            return false;
        }
        return number >= 2010 && number <= 2020;
    }, pid(field) {
        return /^[0-9]{9}$/.test(field);
    },
    byr: (field) => {
        const number = parseInt(field, 10);
        if (isNaN(number)) {
            return false;
        }
        return number >= 1920 && number <= 2002;
    }

}

function passportFieldsValid(passport: Passport): boolean {
    const passportDict = Object.fromEntries(passport) as Record<PassportField, string>;
    return requiredFields.every(key => fieldValidator[key](passportDict[key]));
}


const data = await Deno.readTextFile("./inputs/day4.txt");
const passports: Passport[] = parsePassports(data);
const passportsHavingFields = passports.filter(passportHasFields);
const validPassports = passportsHavingFields.filter(passportFieldsValid);
console.log('part 1', passportsHavingFields.length);
console.log('part 2', validPassports.length)

Deno.test("validator byr", () => {
    const {byr} = fieldValidator;
    assert(byr('2002'));
    assert(!byr('2003'));
});
Deno.test("validator hgt", () => {
    const {hgt} = fieldValidator;
    assert(hgt('60in'));
    assert(hgt('190cm'));
    assert(!hgt('190in'));
    assert(!hgt('190'));
});
Deno.test("validator hcl", () => {
    const {hcl} = fieldValidator;
    assert(hcl('#123abc'))
    assert(!hcl('#123abz'))
    assert(!hcl('123abc'))
});
Deno.test("validator ecl", () => {
    const {ecl} = fieldValidator;
    assert(ecl('brn'));
    assert(!ecl('wat'));
});
Deno.test("validator pid", () => {
    const {pid} = fieldValidator;
    assert(pid('000000001'));
    assert(!pid('0123456789'));
});

Deno.test("passport has fields", function () {
    const passport = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm`;

    assert(passportHasFields(parsePassportFields(passport)));
});

Deno.test("invalid passports", () => {
    const invalidPassports: Passport[] = parsePassports(`eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`);
    assert(invalidPassports.every(p => !passportFieldsValid(p)));
})

Deno.test("valid passports", () => {
    const invalidPassports: Passport[] = parsePassports(`pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`);
    assert(invalidPassports.every(passportFieldsValid));
})

