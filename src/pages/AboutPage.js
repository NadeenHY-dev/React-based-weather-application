/**
 * AboutPage component provides information about the application.
 * It explains the app's purpose and main features, and lists the creator.
 *
 * @component
 * @returns {JSX.Element} The rendered About page.
 */
function AboutPage() {
  return (
    <div>
      <h2>About This App</h2>
      <p>This app allows you to save and manage cities with their geographic coordinates.</p>
      <p>You can:</p>
      <ul>
        <li>Add a new city with its country, latitude, and longitude.</li>
        <li>Edit existing cities.</li>
        <li>Delete cities you no longer need.</li>
        <li>Prevent duplicates and invalid inputs.</li>
      </ul>
      <p>Built with ❤️ using React and React-Bootstrap.</p>

      <h4 className="mt-4">Created by:</h4>
      <ul>
        <li>Nadeen Haj Yahia – nadeenha@edu.jmc.ac.il</li>
      </ul>
    </div>
  );
}

export default AboutPage;
