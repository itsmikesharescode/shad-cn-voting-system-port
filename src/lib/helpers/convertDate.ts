



export const dateConvert = (dateLink: string) =>
{
    const date = new Date(dateLink);
    const verbalWeek = ["Sunday", "Monday", "Tuestday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const verbalMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ];

    const verbalDate = `${verbalWeek[date.getDay()]}, ${verbalMonths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`; 

    return verbalDate;
}