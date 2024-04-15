from argon2 import PasswordHasher
import pandas as pd
from tqdm import tqdm
import random

random.seed(22)

# Use argon2id to create password hashes
ph = PasswordHasher()

# Use generic accounts csv as base
acct_src = pd.read_csv('./DefaultCreds-Cheat-Sheet.csv')

# Get rid of blanks
acct_src = acct_src.replace('<blank>', 'user')

# Treat username as firstname, productvendor as lastname
acct_src = acct_src.rename({'username': 'first_name'}, axis=1)
acct_src = acct_src.rename({'productvendor': 'last_name'}, axis=1)

# Use first_name + number @ last_name as email
acct_src['email_addr'] = acct_src.apply(
    lambda row: f"{row['first_name']}{row.name}@{row['last_name']}.com",
    axis=1
)

# Randomize save history flag
acct_src['save_history'] = acct_src.apply(
    lambda _: random.randint(0, 1),
    axis=1
)

# Remove whitespace
acct_src['email_addr'] = acct_src['email_addr'].replace(' ', '_', regex=True)

# Hash passwords
tqdm.pandas()
print('Hashing Passwords')
acct_src['password_hash'] = acct_src['password'].progress_map(
    lambda p: ph.hash(p))
acct_src = acct_src.drop('password', axis=1)

# Save to file
acct_src.to_csv('GenericAccounts.csv', index=None)
