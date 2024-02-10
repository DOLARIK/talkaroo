
def remove_duplicates(source_list, reference_list):
    # Convert reference_list to a set for faster lookups
    # reference_set = set(reference_list)
    
    # Use list comprehension to create a new list with unique elements
    result_list = [item for item in source_list if item not in reference_list]
    
    return result_list