<?php
/*
    $content = "
<page>
    <h1>Exemple d'utilisation</h1>
    <br>
    Ceci est un <b>exemple d'utilisation</b>
    de <a href='http://html2pdf.fr/'>HTML2PDF</a>.<br>
</page>
<page>
    <h1>Exemple d'utilisation</h1>
    <br>
    Ceci est un <b>exemple d'utilisation</b>
    de <a href='http://html2pdf.fr/'>HTML2PDF</a>.<br>
</page>";
*/

	

	//$content = file_get_contents(dirname(__FILE__).'/html4Planea.html');
	//$argv[0] is this file
	if (count($argv)!=4) {
		print "convertopdf needs exactly 2 arguments: [path to source HTML file] [path to destination PDF file]";
		exit(1);
	}
	$content_html_file = $argv[1];
	$content_pdf_file = $argv[2];
	$content_pdf_file_css = $argv[3];
	
	$content = file_get_contents( $content_html_file );
	
    $content = '<page style="font-family: freeserif"><br />'.nl2br($content).'</page>';
    
    //require_once(dirname(__FILE__).'/html2pdf/html2pdf.class.php');
	include( dirname(__FILE__).'\mpdf\mpdf.php');

	$content = str_ireplace( array(	"font-family:'Times New Roman';",	
									"font-family:Times New Roman;",
									"font-family:'Verdana'",
									"font-family:Verdana;",
									"<tbody>",
									"</tbody>",
									"<thead>",
									"</thead>",
									"<tfoot>",
									"</tfoot>"), 
							array(	"",
									"",
									"",
									"",
									"",
									"",
									"",
									"",
									"",
									""), $content );
									
	$content = str_ireplace( 	array('<newpage orientation="horizontal" section="start"> </newpage>',
									  '<newpage orientation="horizontal" section="end"> </newpage>',
									  '<newpage orientation="vertical" section="start"> </newpage>',
									  '<newpage orientation="vertical" section="end"> </newpage>'),
								array(	'<pagebreak orientation="landscape"/>',
										'',
										'<pagebreak orientation="portrait"/>',
										''),
								$content );
	//echo $content;
	//$stylesheet = file_get_contents('site_pdf.css');
	//$stylesheet = file_get_contents('../../chrome/skin/site_pdf.css');
		// The parameter 1 tells that this is css/style only and no body/html/text
	//if ($stylesheet=="")
	//$stylesheet = file_get_contents($content_pdf_file_css);							

	try
    {
        //$html2pdf = new HTML2PDF('P', 'A4', 'fr');
		$html2pdf = new MPDF('P', 'A4', 'fr');
		//$html2pdf->shrink_tables_to_fit=0;
		//$html2pdf->WriteHTML($stylesheet,1);
        $result = $html2pdf->writeHTML($content);
		echo "RESULT:".$result;
        $html2pdf->Output( $content_pdf_file , 'F' );
    }
    catch(HTML2PDF_exception $e) {
        echo "EXCEPTION ERROR".$e;
        exit(1);
    }
	
?>

