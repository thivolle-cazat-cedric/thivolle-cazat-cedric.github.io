#!/usr/bin/env python3
import json


def main():
    dishes = []
    for line in open('carte.csv', 'r').readlines():
        if not line.strip():
            continue
        name, kind, price, desc = line.strip().split(';', 3)
        dishes.append({
            "title": name,
            "description": desc,
            "kind": kind.lower(),
            "price": price,
        })
    json.dump({
        "dishes": dishes[1:]
    }, open('../public/res/data.json', 'w'))

if __name__ == '__main__':
    main()
