from pathlib import Path
from typing import TypedDict
from aqt import mw

# Code Your Answer Model Parameters

class CYAModelConfig(TypedDict):
    name: str
    fields: list[str]

CYA_MODEL: CYAModelConfig = {
    "name": "Code Your Answer",
    "fields": [
        "Front",
        "Back",
        "Back Extra",
        "Language"
    ],
}

## Templates

def load_template(file_name: str) -> str:
    """
    Loads an HTML template file from the templates directory.

    Args:
        file_name: Template file name.

    Returns:
        Template content as UTF-8 text.
    """
    base = Path(__file__).parent / "templates"
    file_path = base / file_name

    return file_path.read_text(encoding="utf-8")

## Model Functions

def model_exists(name: str) -> bool:
    """
    Checks whether a note type (model) exists in Anki.

    Args:
        name (str): The name of the note type to check.
    
    Returns:
        bool: True if the model exists, False otherwise.
    """

    return any(
        model["name"] == name for model in mw.col.models.all()
    )


def create_model(name: str, fields: list[str]) -> None:
    """
    Creates a new Anki note type (model) with the given fields.

    Args:
        name (str): Name of the note type.
        fields (list of strings): List containing the names of it's fields
    Returns:
        None
    
    Example:
        >>> create_model("Code Your Ans", ["Front", "Back", "Back Extra", "Language"])
    """

    model = mw.col.models.new(name)

    # fields
    for field_name in fields:
        field = mw.col.models.new_field(field_name)
        mw.col.models.add_field(model, field)
    
    # templates
    template = mw.col.models.new_template(CYA_MODEL["name"])

    front_html = load_template("front.html")
    back_html = load_template("back.html")

    template["qfmt"] = front_html
    template["afmt"] = back_html
    
    mw.col.models.add_template(model, template)
    mw.col.models.add(model)


def ensure_model_exists(name: str, fields: list[str]) -> None:
    """
    Ensures a model exists. Create it if missing.

    Args:
        name: The name of the model (Anki Note Type).
        fields: A list of the model's field names.
    
    Returns:
        None
    """

    if model_exists(name):
        return
    
    create_model(name, fields)

## Setup

def init_cya() -> None:
    """
    Creates the Code Your Answer note type (model) if it doesn't exists.
    """
    ensure_model_exists(
        CYA_MODEL["name"],
        CYA_MODEL["fields"]
    )