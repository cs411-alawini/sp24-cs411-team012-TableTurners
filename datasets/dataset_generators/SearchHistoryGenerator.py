import os
import string 
import random

random.seed(22)

"""
CSV FILE ORIGINAL FORMAT:
user_id,first_name,last_name,password_hash,email_addr

DATABASE SCHEMA:
history_id,user_id,search_string,timestamp

"""

# Determine list of generic search strings
searchList = [  'apple', 'orange', 'apricot', 'banana', 'blackberry',
				'grapes', 'strawberries', 'broccoli', 'spinach', 'mushroom',
				'carrots', 'onions', 'ketchup', 'mustard', 'mayonnaise', 'cherries', 
				'watermelon', 'pork', 'beef', 'chicken', 'veal', 'lamb', 'ground beef',
				'pork shoulder', 'potatoes', 'garlic', 'pineapple', 'kiwi', 'ribs', 'rice',
				'bread', 'wheat bread', 'white bread', 'whole wheat bread', 'sourdough bread',
				'pasta', 'spaghetti', 'penne', 'linguini', 'fettuccine', 'radish', 'ham', 'cheese',
				'swiss cheese', 'provolone', 'bleu cheese', 'feta cheese', 'yogurt', 'gochujang', 
				'lao gan ma', 'soy sauce', 'salt', 'pepper', 'garlic powder', 'cumin', 'paprika', 
				'saffron', 'tea', 'chocolate', 'green tea', 'earl grey tea', 'black tea', 'vinegar'						
			]

# Open file we want to write to
fileWrite = open( "SearchHistories.csv", "w" )
fileWrite.writelines( [ "user_id,search_string\n" ] )

numAccounts = 3547
for i in range( 1, 3548 ):
	# Get random account number (not every account will 
	# necessarily have an associated Search
	accountNum = random.randint( 1, 3547 )
	
	user_id = accountNum

	# Generate a search string
	numIterations = random.randint( 1, 3 )

	searchString = ''
	term = ''
	for j in range( numIterations ):
		while term in searchString:
			term = random.choice( searchList )
		
		searchString = searchString + ' ' + term

	# Remove leading space
	searchString = searchString[ 1: ]

	insertionLine = str( user_id ) + ',' + searchString + ';\n'
	fileWrite.writelines( [ insertionLine ] )


			