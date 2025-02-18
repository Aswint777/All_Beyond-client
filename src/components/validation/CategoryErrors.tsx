export interface categoryErrors {
    name?: string;
    description?: string;
    type?: string;
  }

  export const validateCategory = (
    name: string,
    description: string,
    type: string,
  ): categoryErrors => {
    const errors: categoryErrors = {};

    if (!name.trim()) {
      errors.name = "Name is required.";
    }
    if (!description.trim()) {
      errors.description = "description is required."
    } 
    if (!type) {
      errors.type = "type is required.";
    }
    if(description.length < 10){
        errors.description = "description is too short."
    }
    if(description.length > 30){
        errors.description = "description is too lengthy."
    }
    if (name.length < 3) {
      errors.name = "Category Name is too short.";
    } else if (name.length > 15) {
      errors.name = "Category Name is too lengthy.";
    }

    return errors;
  };
  