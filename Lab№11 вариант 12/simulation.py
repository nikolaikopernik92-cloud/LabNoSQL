import random, hashlib
from collections import Counter

random.seed(42)
N, Q, SHARDS = 12000, 30000, 3

# Вариант 12: Отель. user_id -> guestId, category -> cityId, event_id -> bookingId
rows = [dict(guestId=i % 2500,           # 2500 уникальных гостей (>= 1000)
             cityId=i % 5,               # 5 городов (низкая кардинальность)
             bookingId=i,                # монотонный идентификатор бронирования
             dayBucket=(i // 40) % 30)   # день заезда (для составного ключа)
        for i in range(N)]

def stable_hash(value):
    digest = hashlib.sha256(str(value).encode()).digest()
    return int.from_bytes(digest[:8], 'big')

def low_card(row):         return row['cityId'] % SHARDS
def hashed_guest(row):     return stable_hash(row['guestId']) % SHARDS
def range_booking(row):    return min(row['bookingId'] // (N // SHARDS), SHARDS - 1)
def hashed_guest_day(row): return stable_hash((row['guestId'], row['dayBucket'])) % SHARDS

def describe(name, assign, data, requests):
    docs = Counter(assign(r) for r in data)
    load = Counter(assign(r) for r in requests)
    d = [docs[i] for i in range(SHARDS)]
    q = [load[i] for i in range(SHARDS)]
    res = dict(name=name, docs=d, queries=q,
               doc_mm=round(max(d)/(sum(d)/SHARDS), 2),
               q_mm=round(max(q)/(sum(q)/SHARDS), 2),
               q_min=round(max(q)/min(q), 2) if min(q) > 0 else None)
    print(name, 'docs=', d, 'queries=', q,
          'doc_max_mean=',