

def is_password_valid(_min: int, _max: int, letter: str, password: str) -> bool: 
    occur = {}
    if _max < _min: 
        raise
    
    if _min > 0 and letter not in password:
        return False
       
    for lt in password: 
        if lt in occur:
            occur[lt] += 1
        else: 
            occur[lt] = 1
    return _min <= occur[letter] <= _max


with open('day2.txt', 'r') as d2:
    count = 0
    for l in d2:
        rng, lett, pwd = l.split(' ')
        _min, _max = rng.split('-')
        letter = lett[:-1]
        if is_password_valid(_min, _max, letter, pwd):
            count += 1
    print(count)


# PART 2

def is_password_valid2(_min: int, _max: int, letter: str, password: str) -> bool:
    a = password[_min-1]
    b = password[_max-1]
    
    return (a == letter and b != letter) or (b == letter and a != letter)


with open('day2.txt', 'r') as d2:
    count = 0
    for l in d2:
        rng, lett, pwd = l.split(' ')
        _min, _max = rng.split('-')
        letter = lett[:-1]
        if is_password_valid2(int(_min), int(_max), letter, pwd):
            count += 1

    print('part 2', count)